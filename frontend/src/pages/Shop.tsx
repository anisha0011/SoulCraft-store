import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown, X, Search, Check } from 'lucide-react';
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
    setIsMobileFiltersOpen(false);
  };

  return (
    <div className="bg-[#FFF9FB] min-h-screen py-6 sm:py-12">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Page Header */}
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-[#3A2930] mb-2 sm:mb-4">
            {currentSearch ? `Results for "${currentSearch}"` : 'Shop Collection'}
          </h1>
          <p className="text-xs sm:text-base text-[#806B73] max-w-2xl mx-auto px-2">
            Explore our full range of handcrafted goods, made with love and attention to detail.
          </p>
          {currentSearch && (
            <button onClick={clearSearch} className="mt-3 inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#E8A0B8] hover:text-[#C96F91] border border-[#E8A0B8] rounded-full px-3 py-1 bg-white">
              <Search className="w-3 h-3" /> {currentSearch} <X className="w-3 h-3 ml-1" />
            </button>
          )}
        </div>

        {/* Mobile Horizontal Category Pills */}
        <div className="lg:hidden mb-5 -mx-4 px-4 overflow-x-auto no-scrollbar flex items-center gap-2 pb-1">
          <button
            onClick={() => handleCategoryChange('all')}
            className={cn(
              "whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium transition-colors shrink-0 shadow-sm",
              currentCategory === 'all'
                ? "bg-[#3A2930] text-white"
                : "bg-white text-[#3A2930] border border-[#F0DDE4] hover:bg-[#FFF5F8]"
            )}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium transition-colors shrink-0 shadow-sm",
                currentCategory === cat.slug
                  ? "bg-[#3A2930] text-white"
                  : "bg-white text-[#3A2930] border border-[#F0DDE4] hover:bg-[#FFF5F8]"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Mobile Controls Bar */}
        <div className="lg:hidden flex items-center justify-between gap-3 mb-5 bg-white p-2.5 rounded-2xl border border-[#F0DDE4] shadow-sm">
          <button 
            onClick={() => setIsMobileFiltersOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium text-[#3A2930] hover:text-[#E8A0B8] transition-colors border-r border-[#F0DDE4]"
          >
            <Filter className="h-4 w-4 text-[#E8A0B8]" />
            Filters {currentCategory !== 'all' ? '(1)' : ''}
          </button>
          
          <div className="flex-1 relative flex items-center justify-center">
            <select 
              value={currentSort} 
              onChange={handleSortChange}
              className="w-full appearance-none bg-transparent text-center text-xs font-medium text-[#3A2930] py-2 pl-2 pr-6 focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="newest">New Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Best Rated</option>
            </select>
            <ChevronDown className="absolute right-2 top-2.5 h-3.5 w-3.5 text-[#806B73] pointer-events-none" />
          </div>
        </div>

        {/* Mobile Filters Drawer */}
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-[80] bg-[#3A2930]/40 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileFiltersOpen(false)}>
            <div className="absolute right-0 top-0 bottom-0 w-4/5 max-w-xs bg-white shadow-2xl p-6 flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between pb-4 border-b border-[#F0DDE4] mb-4">
                <h3 className="font-serif text-lg font-bold text-[#3A2930]">Filter & Sort</h3>
                <button onClick={() => setIsMobileFiltersOpen(false)} className="p-1 text-[#806B73] hover:text-[#3A2930]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6">
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-[#806B73] mb-3">Categories</h4>
                  <div className="space-y-1.5">
                    {[{ id: 'all', name: 'All Products', slug: 'all' }, ...categories].map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.slug)}
                        className={cn(
                          "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors text-left",
                          (cat.slug === currentCategory || (cat.slug === 'all' && currentCategory === 'all'))
                            ? "bg-[#FFF5F8] text-[#E8A0B8] font-bold"
                            : "text-[#3A2930] hover:bg-[#FFF5F8]"
                        )}
                      >
                        <span>{cat.name}</span>
                        {(cat.slug === currentCategory || (cat.slug === 'all' && currentCategory === 'all')) && (
                          <Check className="w-4 h-4 text-[#E8A0B8]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-[#806B73] mb-3">Sort By</h4>
                  <div className="space-y-1.5">
                    {[
                      { label: 'Featured', value: 'featured' },
                      { label: 'New Arrivals', value: 'newest' },
                      { label: 'Price: Low to High', value: 'price-low' },
                      { label: 'Price: High to Low', value: 'price-high' },
                      { label: 'Best Rated', value: 'rating' },
                    ].map(f => (
                      <button
                        key={f.value}
                        onClick={() => { const p = new URLSearchParams(searchParams); p.set('sort', f.value); setSearchParams(p); setIsMobileFiltersOpen(false); }}
                        className={cn(
                          "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors text-left",
                          currentSort === f.value
                            ? "bg-[#FFF5F8] text-[#E8A0B8] font-bold"
                            : "text-[#3A2930] hover:bg-[#FFF5F8]"
                        )}
                      >
                        <span>{f.label}</span>
                        {currentSort === f.value && <Check className="w-4 h-4 text-[#E8A0B8]" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F0DDE4] space-y-2">
                <Button onClick={() => setIsMobileFiltersOpen(false)} className="w-full">
                  Show Results ({products.length})
                </Button>
                {(currentCategory !== 'all' || currentSort !== 'featured' || currentSearch) && (
                  <button onClick={clearAll} className="w-full text-xs text-[#D9536F] font-medium py-2">
                    Reset All Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters — Desktop */}
          <div className="hidden lg:block lg:w-56 shrink-0">
            <div className="bg-white rounded-2xl border border-[#F0DDE4] p-6 sticky top-28 shadow-sm">
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
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse flex flex-col">
                    <div className="bg-gray-200 aspect-[4/5] rounded-xl sm:rounded-2xl mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 sm:py-24 bg-white rounded-3xl border border-[#F0DDE4] p-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#FFF5F8] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Search className="w-8 h-8 sm:w-10 sm:h-10 text-[#E8A0B8]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-serif text-[#3A2930] mb-2">No products found</h3>
                <p className="text-xs sm:text-sm text-[#806B73] mb-6 max-w-sm mx-auto">
                  {currentSearch ? `No results for "${currentSearch}". Try a different keyword.` : "We couldn't find any products matching your filters."}
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
