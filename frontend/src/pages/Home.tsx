import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Sparkles, HeartHandshake, ShieldCheck, Camera } from 'lucide-react';
import { Button } from '../components/common/Button';
import ProductCard from '../components/shop/ProductCard';
import { productsApi, categoriesApi } from '../api';
import type { Product, Category } from '../types';
import { toast } from '../store/useToastStore';

export default function Home() {
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');

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

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    toast.success('Welcome to Soul Craft! 💗', 'You have been subscribed to our newsletter. Check your inbox soon for exclusive handmade stories & discounts.');
    setNewsletterEmail('');
  };

  const galleryImages = [
    {
      url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop',
      title: 'Botanical & Floral Arrangements',
      category: 'Dried Florals'
    },
    {
      url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
      title: 'Resin & Botanical Keepsakes',
      category: 'Resin Art'
    },
    {
      url: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?q=80&w=800&auto=format&fit=crop',
      title: 'Custom Quilling & Lettering',
      category: 'Paper Art'
    },
    {
      url: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?q=80&w=800&auto=format&fit=crop',
      title: 'Woven Macrame Hangings',
      category: 'Fiber Art'
    },
    {
      url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800&auto=format&fit=crop',
      title: 'Hand-sculpted Accents',
      category: 'Ceramics'
    },
    {
      url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop',
      title: 'Artisan Gift Packaging',
      category: 'Gift Boxes'
    }
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-[#FFF9FB]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1615486511484-92e172fc4fee?q=80&w=2070&auto=format&fit=crop" 
            alt="Handcrafted items" 
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFF9FB]/50 via-transparent to-[#FFF9FB]" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#F0DDE4] text-[#E8A0B8] text-sm font-medium mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-[#E8A0B8]" />
            <span>Handmade with Love & Care</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-[#3A2930] mb-6 leading-tight drop-shadow-sm">
            Made by Hand. <br/>
            <span className="italic text-[#E8A0B8]">Made with Soul.</span>
          </h1>
          <p className="text-lg md:text-xl text-[#806B73] mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover bespoke handcrafted keepsakes, custom resin art, and thoughtful gifts tailored uniquely to your moments.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/shop">
              <Button size="lg" className="w-full sm:w-auto px-10 shadow-md">Shop Collection</Button>
            </Link>
            <Link to="/custom-orders">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-10 bg-white/70 backdrop-blur-sm border-[#E8A0B8] text-[#3A2930] hover:bg-white">
                Create a Custom Order
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Value Proposition Banner */}
      <section className="bg-white border-y border-[#F0DDE4] py-8">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-4 p-2">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF5F8] text-[#E8A0B8] flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-[#3A2930] text-sm md:text-base">100% Handcrafted</h4>
                <p className="text-xs text-[#806B73]">Made in small artisan batches</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-2">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF5F8] text-[#E8A0B8] flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-[#3A2930] text-sm md:text-base">Free Delivery</h4>
                <p className="text-xs text-[#806B73]">On all orders above ₹999</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-2">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF5F8] text-[#E8A0B8] flex items-center justify-center shrink-0">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-[#3A2930] text-sm md:text-base">Customization</h4>
                <p className="text-xs text-[#806B73]">Names, colors & personal details</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-2">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF5F8] text-[#E8A0B8] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-[#3A2930] text-sm md:text-base">Safe Packaging</h4>
                <p className="text-xs text-[#806B73]">Gift-ready secure delivery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3A2930] mb-4">Explore Categories</h2>
            <div className="w-16 h-1 bg-[#E8A0B8] mx-auto rounded-full"></div>
            <p className="text-[#806B73] mt-3">Handmade collections designed for warmth and beauty</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                to={`/shop?category=${category.slug}`}
                className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-gray-100 flex flex-col justify-end p-6 shadow-sm hover:shadow-xl transition-shadow"
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
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="bg-[#3A2930] text-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
            <div className="md:w-1/2 p-10 lg:p-16 flex flex-col justify-center">
              <span className="text-[#E8A0B8] text-sm font-semibold tracking-wider uppercase mb-2">Bespoke Creations</span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Your Idea. Our Craft.</h2>
              <p className="text-[#F0DDE4] text-base md:text-lg mb-8 max-w-md leading-relaxed">
                Have a special vision, a specific color palette, or a memorable name? Send us your brief and we will craft a personalized masterpiece just for you.
              </p>
              <div>
                <Link to="/custom-orders">
                  <Button className="bg-white text-[#3A2930] hover:bg-[#FCE7EF] hover:text-[#3A2930] px-8 h-12 text-base font-medium">
                    Start a Custom Order
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 min-h-[340px] md:min-h-0 relative">
              <img 
                src="https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=2070&auto=format&fit=crop" 
                alt="Crafting tools and process" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Visual Showcase / Studio Craft Gallery */}
      <section className="py-20 bg-[#FFF9FB] border-t border-[#F0DDE4]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-[#E8A0B8] font-medium text-sm mb-2">
              <Camera className="w-4 h-4" />
              <span>@SoulCraftStore</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3A2930] mb-4">Behind the Craft</h2>
            <div className="w-16 h-1 bg-[#E8A0B8] mx-auto rounded-full"></div>
            <p className="text-[#806B73] mt-3 max-w-xl mx-auto">
              A peek inside our studio—where dried botanicals, fine paper, epoxy resin, and macrame cords turn into treasured keepsakes.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {galleryImages.map((img, idx) => (
              <div 
                key={idx} 
                className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <img 
                  src={img.url} 
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#3A2930]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#E8A0B8]">{img.category}</span>
                  <span className="text-xs font-medium leading-tight">{img.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3A2930] mb-4">People Love Soul Craft</h2>
            <div className="w-16 h-1 bg-[#E8A0B8] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Priya Sharma", text: "Absolutely beautiful! The finishing was perfect and the packaging was so thoughtful. It made the perfect anniversary gift.", product: "Personalized Name Frame" },
              { name: "Neha Gupta", text: "I ordered a custom resin keychain and it exceeded my expectations. You can really feel the love and care put into making it.", product: "Custom Resin Keychain" },
              { name: "Rahul Verma", text: "The floral gift box was stunning. Customer service was excellent and they accommodated my color requests perfectly.", product: "Floral Handmade Gift Box" }
            ].map((review, i) => (
              <div key={i} className="bg-[#FFF9FB] p-8 rounded-2xl shadow-sm border border-[#F0DDE4] flex flex-col justify-between">
                <div>
                  <div className="flex text-[#F5A623] mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-[#3A2930] italic mb-6">"{review.text}"</p>
                </div>
                <div className="border-t border-[#F0DDE4] pt-4">
                  <p className="font-semibold text-[#3A2930]">{review.name}</p>
                  <p className="text-xs text-[#806B73]">Purchased: {review.product}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-[#FFF5F8] text-center border-t border-[#F0DDE4]">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3A2930] mb-4">Get a Little More Soul in Your Inbox 💗</h2>
          <p className="text-[#806B73] mb-8">Subscribe to our newsletter for exclusive offers, new arrivals, and behind-the-scenes craft stories.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleNewsletterSubmit}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 h-12 rounded-full border border-[#F0DDE4] px-6 focus:outline-none focus:border-[#E8A0B8] focus:ring-1 focus:ring-[#E8A0B8] bg-white text-sm"
              required
            />
            <Button type="submit" size="lg" className="rounded-full">Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  );
}
