import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '../components/common/Button';
import ProductCard from '../components/shop/ProductCard';
import { productsApi, categoriesApi } from '../api';
import type { Product, Category } from '../types';

export default function Home() {
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [best, cats] = await Promise.all([
          productsApi.getBestsellers(),
          categoriesApi.getAll()
        ]);
        setBestsellers(best.slice(0, 4));
        setCategories(cats);
      } catch (error) {
        console.error("Error fetching homepage data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-[#FFF9FB]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1615486511484-92e172fc4fee?q=80&w=2070&auto=format&fit=crop" 
            alt="Handcrafted items" 
            className="w-full h-full object-cover object-center opacity-40"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-[#3A2930] mb-6 leading-tight drop-shadow-sm">
            Made by Hand. <br/>
            <span className="italic text-[#E8A0B8]">Made with Soul.</span>
          </h1>
          <p className="text-lg md:text-xl text-[#806B73] mb-10 max-w-2xl mx-auto">
            Discover handcrafted pieces created with love, creativity, and a personal touch.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/shop">
              <Button size="lg" className="w-full sm:w-auto px-10">Shop Collection</Button>
            </Link>
            <Link to="/custom-orders">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-10 bg-white/50 backdrop-blur-sm">
                Create a Custom Order
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3A2930] mb-4">Explore Categories</h2>
            <div className="w-16 h-1 bg-[#E8A0B8] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                to={`/shop?category=${category.slug}`}
                className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-gray-100 flex flex-col justify-end p-6"
              >
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3A2930]/80 via-[#3A2930]/20 to-transparent"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-serif font-medium text-white mb-2">{category.name}</h3>
                  <div className="inline-flex items-center text-white/90 text-sm font-medium group-hover:text-[#FCE7EF] transition-colors">
                    Explore <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="py-20 bg-[#FFF9FB]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3A2930] mb-2">Made with Love</h2>
              <p className="text-[#806B73]">Handcrafted pieces for moments worth remembering.</p>
            </div>
            <Link to="/shop" className="hidden sm:inline-flex items-center text-[#E8A0B8] font-medium hover:text-[#C96F91] transition-colors">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col">
                  <div className="bg-gray-200 aspect-[4/5] rounded-2xl mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {bestsellers.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="mt-8 text-center sm:hidden">
            <Link to="/shop">
              <Button variant="outline" className="w-full">View All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Custom Order CTA */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 flex">
          <div className="w-1/2 bg-[#FFF5F8]"></div>
          <div className="w-1/2 bg-white"></div>
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="bg-[#3A2930] text-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
            <div className="md:w-1/2 p-12 lg:p-20 flex flex-col justify-center">
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Your Idea. Our Craft.</h2>
              <p className="text-[#F0DDE4] text-lg mb-8 max-w-md leading-relaxed">
                Have a special idea that you can't find anywhere else? Let us create something uniquely yours.
              </p>
              <div>
                <Link to="/custom-orders">
                  <Button className="bg-white text-[#3A2930] hover:bg-[#FCE7EF] hover:text-[#3A2930] px-8 h-12 text-base">
                    Start a Custom Order
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 min-h-[300px] md:min-h-0 relative">
              <img 
                src="https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=2070&auto=format&fit=crop" 
                alt="Crafting tools and process" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#FFF5F8]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3A2930] mb-4">People Love Soul Craft</h2>
            <div className="w-16 h-1 bg-[#E8A0B8] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Priya Sharma", text: "Absolutely beautiful! The finishing was perfect and the packaging was so thoughtful. It made the perfect gift.", product: "Personalized Name Frame" },
              { name: "Neha Gupta", text: "I ordered a custom resin keychain and it exceeded my expectations. You can really feel the love put into making it.", product: "Custom Resin Keychain" },
              { name: "Rahul Verma", text: "The floral gift box was stunning. Customer service was excellent and they accommodated my color requests perfectly.", product: "Floral Handmade Gift Box" }
            ].map((review, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-[#F0DDE4]">
                <div className="flex text-[#F5A623] mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-[#3A2930] italic mb-6">"{review.text}"</p>
                <div>
                  <p className="font-semibold text-[#3A2930]">{review.name}</p>
                  <p className="text-xs text-[#806B73]">Purchased: {review.product}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-white text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3A2930] mb-4">Get a Little More Soul in Your Inbox 💗</h2>
          <p className="text-[#806B73] mb-8">Subscribe to our newsletter for exclusive offers, new arrivals, and behind-the-scenes magic.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 h-12 rounded-full border border-[#F0DDE4] px-6 focus:outline-none focus:border-[#E8A0B8] focus:ring-1 focus:ring-[#E8A0B8]"
              required
            />
            <Button type="submit" size="lg" className="rounded-full">Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  );
}
