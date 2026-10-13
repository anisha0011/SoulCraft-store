import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown, X, Search } from 'lucide-react';
import ProductCard from '../components/shop/ProductCard';
import { productsApi, categoriesApi } from '../api';
import type { Product, Category } from '../types';
import { Button } from '../components/common/Button';
import { cn } from '../utils/utils';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const currentCategory = searchParams.get('category') || 'all';
  const currentSort = searchParams.get('sort') || 'featured';
  const currentSearch = searchParams.get('search') || '';

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [allProducts, cats] = await Promise.all([
          productsApi.getAll(),
          categoriesApi.getAll()
        ]);
        
        let filtered = [...allProducts].filter(p => p.isActive);
        
        // Search filter
        if (currentSearch) {
          const q = currentSearch.toLowerCase();
          filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.tags.some(t => t.toLowerCase().includes(q)) ||
            p.materials.some(m => m.toLowerCase().includes(q))
          );
        }

        // Category filter
        if (currentCategory !== 'all') {
          filtered = filtered.filter(p => p.categoryId === cats.find(c => c.slug === currentCategory)?.id);
        }
        
        // Sort
        switch(currentSort) {
          case 'price-low':
            filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
            break;
          case 'price-high':
            filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
            break;
          case 'newest':
            filtered.sort((a, b) => (a.isNew ? -1 : 1) - (b.isNew ? -1 : 1));
            break;
          case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
          default:
            filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        }

        setProducts(filtered);
        setCategories(cats);
      } catch (error) {
        console.error("Error fetching shop data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentCategory, currentSort, currentSearch]);

  const handleCategoryChange = (slug: string) => {
    const p = new URLSearchParams(searchParams);
    if (slug === 'all') p.delete('category');
    else p.set('category', slug);
    setSearchParams(p);
    setIsMobileFiltersOpen(false);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const p = new URLSearchParams(searchParams);
    p.set('sort', e.target.value);
    setSearchParams(p);
  };

  const clearSearch = () => {
    const p = new URLSearchParams(searchParams);
    p.delete('search');
    setSearchParams(p);
  };

  const clearAll = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="bg-[#FFF9FB] min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#3A2930] mb-4">
            {currentSearch ? `Results for "${currentSearch}"` : 'Shop Collection'}
          </h1>
          <p className="text-[#806B73] max-w-2xl mx-auto">
            Explore our full range of handcrafted goods, made with love and attention to detail.
          </p>
          {currentSearch && (
            <button onClick={clearSearch} className="mt-4 inline-flex items-center gap-1 text-sm text-[#E8A0B8] hover:text-[#C96F91] border border-[#E8A0B8] rounded-full px-3 py-1">
              <Search className="w-3 h-3" /> {currentSearch} <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex justify-between items-center mb-2">
            <Button variant="outline" onClick={() => setIsMobileFiltersOpen(true)} className="flex items-center gap-2">
              <Filter className="h-4 w-4" /> Filters
            </Button>
            <div className="relative">
              <select 
                value={currentSort} 
                onChange={handleSortChange}
                className="appearance-none bg-white border border-[#F0DDE4] text-[#3A2930] py-2 pl-4 pr-10 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#E8A0B8]"
              >
                <option value="featured">Featured</option>
                <option value="newest">New Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Best Rated</option>
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-[#806B73] pointer-events-none" />
            </div>
          </div>

          {/* Mobile Filters Drawer */}
          {isMobileFiltersOpen && (
            <div className="fixed inset-0 z-50 bg-[#3A2930]/30 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileFiltersOpen(false)}>
              <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl p-6" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-xl font-bold text-[#3A2930]">Filters</h3>
                  <button onClick={() => setIsMobileFiltersOpen(false)} className="text-[#806B73]"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-2">
                  {[{ id: 'all', name: 'All Products' }, ...categories].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id === 'all' ? 'all' : categories.find(c => c.id === cat.id)?.slug || 'all')}
                      className={cn(
                        "w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                        (cat.id === 'all' ? currentCategory === 'all' : categories.find(c => c.id === cat.id)?.slug === currentCategory)
                          ? "bg-[#FFF5F8] text-[#E8A0B8] border border-[#E8A0B8]"
                          : "text-[#3A2930] hover:bg-[#FFF5F8]"
                      )}
                    >
                      {'name' in cat ? cat.name : 'All Products'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sidebar Filters — Desktop */}
          <div className="hidden lg:block lg:w-56 shrink-0">
            <div className="bg-white rounded-2xl border border-[#F0DDE4] p-6 sticky top-28">
              <h3 className="font-serif font-semibold text-[#3A2930] text-lg mb-4">Categories</h3>
              <div className="space-y-1.5">
                {[{ slug: 'all', name: 'All Products', id: 'all' }, ...categories].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.slug)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      cat.slug === currentCategory || (cat.slug === 'all' && currentCategory === 'all')
                        ? "bg-[#FFF5F8] text-[#E8A0B8] border border-[#E8A0B8]"
                        : "text-[#3A2930] hover:bg-[#FFF5F8]"
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-[#F0DDE4]">
                <h3 className="font-serif font-semibold text-[#3A2930] text-lg mb-3">Quick Filters</h3>
                <div className="space-y-1.5">
                  {[
                    { label: 'New Arrivals', value: 'newest' },
                    { label: 'Best Rated', value: 'rating' },
                    { label: 'Price: Low → High', value: 'price-low' },
                  ].map(f => (
                    <button
                      key={f.value}
                      onClick={() => { const p = new URLSearchParams(searchParams); p.set('sort', f.value); setSearchParams(p); }}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        currentSort === f.value
                          ? "bg-[#FFF5F8] text-[#E8A0B8]"
                          : "text-[#3A2930] hover:bg-[#FFF5F8]"
                      )}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {(currentCategory !== 'all' || currentSort !== 'featured' || currentSearch) && (
                <button onClick={clearAll} className="mt-4 w-full text-xs text-[#D9536F] hover:text-red-700 font-medium text-center">
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {/* Sort bar — desktop */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <p className="text-sm text-[#806B73]">
                {isLoading ? '...' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
              </p>
              <div className="relative">
                <select 
                  value={currentSort} 
                  onChange={handleSortChange}
                  className="appearance-none bg-white border border-[#F0DDE4] text-[#3A2930] py-2 pl-4 pr-10 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#E8A0B8]"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">New Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Best Rated</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-[#806B73] pointer-events-none" />
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse flex flex-col">
                    <div className="bg-gray-200 aspect-[4/5] rounded-2xl mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <div className="w-20 h-20 bg-[#FFF5F8] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-[#E8A0B8]" />
                </div>
                <h3 className="text-2xl font-serif text-[#3A2930] mb-2">No products found</h3>
                <p className="text-[#806B73] mb-6">
                  {currentSearch ? `No results for "${currentSearch}". Try a different search.` : "We couldn't find any products matching your filters."}
                </p>
                <Button onClick={clearAll}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
