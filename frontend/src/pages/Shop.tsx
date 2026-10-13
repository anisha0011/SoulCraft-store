import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown, SlidersHorizontal, X } from 'lucide-react';
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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [allProducts, cats] = await Promise.all([
          productsApi.getAll(),
          categoriesApi.getAll()
        ]);
        
        let filtered = [...allProducts];
        
        // Filter
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
            filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
          default:
            // featured
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
  }, [currentCategory, currentSort]);

  const handleCategoryChange = (slug: string) => {
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
    setIsMobileFiltersOpen(false);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    searchParams.set('sort', e.target.value);
    setSearchParams(searchParams);
  };

  return (
    <div className="bg-[#FFF9FB] min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#3A2930] mb-4">Shop Collection</h1>
          <p className="text-[#806B73] max-w-2xl mx-auto">Explore our full range of handcrafted goods, made with love and attention to detail.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <Button variant="outline" onClick={() => setIsMobileFiltersOpen(true)} className="flex items-center gap-2">
              <Filter className="h-4 w-4" /> Filters
            </Button>
            <div className="relative">
              <select 
                value={currentSort} 
                onChange={handleSortChange}
                className="appearance-none bg-white border border-[#F0DDE4] text-[#3A2930] py-2 pl-4 pr-10 rounded-md focus:outline-none focus:ring-1 focus:ring-[#E8A0B8]"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Best Rated</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-[#806B73] pointer-events-none" />
            </div>
          </div>

          {/* Sidebar Filters */}
          <aside className={cn(
            "lg:w-1/4 lg:block flex-shrink-0",
            isMobileFiltersOpen ? "fixed inset-0 z-50 bg-white p-6 overflow-y-auto" : "hidden"
          )}>
            {isMobileFiltersOpen && (
              <div className="flex justify-between items-center mb-8 lg:hidden">
                <h2 className="text-xl font-serif font-bold text-[#3A2930]">Filters</h2>
                <button onClick={() => setIsMobileFiltersOpen(false)}><X className="h-6 w-6 text-[#3A2930]" /></button>
              </div>
            )}
            
            <div className="space-y-8">
              <div>
                <h3 className="font-semibold text-[#3A2930] mb-4 flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" /> Categories
                </h3>
                <ul className="space-y-3">
                  <li>
                    <button 
                      onClick={() => handleCategoryChange('all')}
                      className={cn("text-sm hover:text-[#E8A0B8] transition-colors", currentCategory === 'all' ? "text-[#E8A0B8] font-medium" : "text-[#806B73]")}
                    >
                      All Products
                    </button>
                  </li>
                  {categories.map(category => (
                    <li key={category.id}>
                      <button 
                        onClick={() => handleCategoryChange(category.slug)}
                        className={cn("text-sm hover:text-[#E8A0B8] transition-colors text-left", currentCategory === category.slug ? "text-[#E8A0B8] font-medium" : "text-[#806B73]")}
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Additional filters can go here (Price range, occasion, etc.) */}
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:w-3/4 flex-grow">
            {/* Desktop Sort */}
            <div className="hidden lg:flex justify-between items-center mb-8 pb-4 border-b border-[#F0DDE4]">
              <p className="text-[#806B73] text-sm">Showing {products.length} products</p>
              <div className="relative flex items-center gap-3">
                <span className="text-sm text-[#806B73]">Sort by:</span>
                <div className="relative">
                  <select 
                    value={currentSort} 
                    onChange={handleSortChange}
                    className="appearance-none bg-white border border-[#F0DDE4] text-[#3A2930] py-2 pl-4 pr-10 rounded-md focus:outline-none focus:ring-1 focus:ring-[#E8A0B8] text-sm font-medium min-w-[180px]"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest Arrivals</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Best Rated</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-[#806B73] pointer-events-none" />
                </div>
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
              <div className="text-center py-20">
                <h3 className="text-2xl font-serif text-[#3A2930] mb-2">No products found</h3>
                <p className="text-[#806B73] mb-6">We couldn't find any products matching your current filters.</p>
                <Button onClick={() => handleCategoryChange('all')}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
