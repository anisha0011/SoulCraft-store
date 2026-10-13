import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, Heart, ShieldCheck, Truck, Clock, ChevronRight, Plus, Minus, ShoppingBag } from 'lucide-react';
import { productsApi } from '../api';
import type { Product } from '../types';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { formatCurrency } from '../utils/utils';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { toast } from '../store/useToastStore';
import ProductCard from '../components/shop/ProductCard';

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mainImage, setMainImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customName, setCustomName] = useState('');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [openAccordion, setOpenAccordion] = useState<string | null>('details');
  
  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      setIsLoading(true);
      try {
        const data = await productsApi.getBySlug(slug);
        if (data) {
          setProduct(data);
          setMainImage(0);
          setQuantity(1);
          // Fetch related products
          const all = await productsApi.getAll();
          const related = all
            .filter(p => p.id !== data.id && p.categoryId === data.categoryId && p.isActive)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error("Error fetching product", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen py-8 sm:py-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="lg:w-1/2 animate-pulse">
              <div className="bg-gray-200 aspect-[4/5] rounded-2xl"></div>
            </div>
            <div className="lg:w-1/2 space-y-4 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-5 bg-gray-200 rounded w-1/4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center flex-col gap-4 px-4 text-center">
        <h2 className="text-2xl font-serif">Product not found</h2>
        <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const price = product.salePrice || product.price;
  const isDiscounted = product.salePrice && product.salePrice < product.price;

  const handleAddToCart = () => {
    addToCart(product, quantity, product.isCustomizable && customName ? { name: customName } : undefined);
    toast.success('Added to cart!', `${product.name} (qty: ${quantity}) is in your cart.`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, product.isCustomizable && customName ? { name: customName } : undefined);
    navigate('/checkout');
  };

  const handleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.info('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist! 💕');
    }
  };

  const accordionItems = [
    {
      id: 'details',
      title: 'Product Details',
      content: (
        <div className="space-y-2 text-xs sm:text-sm text-[#806B73]">
          <div className="grid grid-cols-2 gap-2">
            <div><span className="font-medium text-[#3A2930]">Materials:</span><br/>{product.materials.join(', ')}</div>
            <div><span className="font-medium text-[#3A2930]">Dimensions:</span><br/>{product.dimensions}</div>
            <div><span className="font-medium text-[#3A2930]">SKU:</span><br/>{product.sku}</div>
            <div><span className="font-medium text-[#3A2930]">Available Colors:</span><br/>{product.colors.join(', ')}</div>
          </div>
        </div>
      )
    },
    {
      id: 'care',
      title: 'Care Instructions',
      content: <p className="text-xs sm:text-sm text-[#806B73]">{product.careInstructions}</p>
    },
    {
      id: 'shipping',
      title: 'Shipping & Processing',
      content: (
        <div className="space-y-1.5 text-xs sm:text-sm text-[#806B73]">
          <p><span className="font-medium text-[#3A2930]">Processing time:</span> {product.processingTime}</p>
          <p>{product.shippingInfo}</p>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white min-h-screen pb-20 md:pb-0">
      {/* Breadcrumb */}
      <div className="bg-[#FFF9FB] border-b border-[#F0DDE4]">
        <div className="container mx-auto px-4 md:px-8 py-2.5 sm:py-3">
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-[#806B73] overflow-x-auto no-scrollbar whitespace-nowrap">
            <Link to="/" className="hover:text-[#E8A0B8] transition-colors shrink-0">Home</Link>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <Link to="/shop" className="hover:text-[#E8A0B8] transition-colors shrink-0">Shop</Link>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <span className="text-[#3A2930] font-medium truncate max-w-[200px] sm:max-w-none">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-6 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          
          {/* Images Section */}
          <div className="lg:w-1/2 flex flex-col-reverse md:flex-row gap-3 sm:gap-4 h-fit lg:sticky lg:top-28">
            {product.images.length > 1 && (
              <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto no-scrollbar py-1">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setMainImage(idx)}
                    className={`relative shrink-0 w-16 h-20 rounded-xl overflow-hidden border-2 transition-all ${mainImage === idx ? 'border-[#E8A0B8] ring-2 ring-[#E8A0B8]/30' : 'border-[#F0DDE4] hover:border-[#E8A0B8]/50'}`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="flex-grow rounded-2xl overflow-hidden bg-[#FFF5F8] aspect-[4/5] relative group shadow-sm">
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-col gap-1.5 sm:gap-2">
                {product.isNew && <Badge variant="success">NEW</Badge>}
                {isDiscounted && (
                  <Badge variant="destructive">
                    {Math.round((1 - (product.salePrice! / product.price)) * 100)}% OFF
                  </Badge>
                )}
                {product.stock <= product.lowStockThreshold && product.stock > 0 && (
                  <Badge variant="secondary">Only {product.stock} left!</Badge>
                )}
              </div>
              <img 
                src={product.images[mainImage]} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:w-1/2">
            {/* Occasions */}
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {product.occasion.map(o => (
                <span key={o} className="text-[11px] sm:text-xs bg-[#FFF5F8] text-[#E8A0B8] px-2.5 py-1 rounded-full font-medium">{o}</span>
              ))}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#3A2930] mb-2 sm:mb-3">
              {product.name}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${i < Math.floor(product.rating) ? 'fill-current' : i < product.rating ? 'fill-current opacity-50' : 'fill-transparent'}`} />
                ))}
              </div>
              <span className="text-xs sm:text-sm text-[#806B73]">{product.rating} <span className="text-[#C4A8B3]">({product.reviewCount} reviews)</span></span>
            </div>

            {/* Price Card */}
            <div className="mb-5 sm:mb-6 p-3.5 sm:p-4 bg-[#FFF9FB] rounded-2xl border border-[#F0DDE4]">
              {isDiscounted ? (
                <div className="flex items-baseline gap-2.5 sm:gap-3">
                  <span className="text-2xl sm:text-3xl font-bold text-[#3A2930]">{formatCurrency(price)}</span>
                  <span className="text-base sm:text-lg text-[#806B73] line-through">{formatCurrency(product.price)}</span>
                  <span className="text-xs sm:text-sm text-[#4F9D69] font-medium">
                    Save {formatCurrency(product.price - price)}
                  </span>
                </div>
              ) : (
                <span className="text-2xl sm:text-3xl font-bold text-[#3A2930]">{formatCurrency(price)}</span>
              )}
              <p className="text-[11px] sm:text-xs text-[#806B73] mt-1">Inclusive of all taxes · Free delivery on orders over ₹999</p>
            </div>

            <p className="text-xs sm:text-sm text-[#806B73] leading-relaxed mb-6">{product.description}</p>

            {/* Customization Card */}
            {product.isCustomizable && (
              <div className="bg-[#FFF5F8] border border-[#F0DDE4] rounded-2xl p-4 mb-6">
                <h4 className="font-semibold text-sm sm:text-base text-[#3A2930] flex items-center gap-2 mb-2">
                  ✨ Personalize This Item
                </h4>
                <div>
                  <label className="block text-xs font-medium text-[#806B73] mb-1.5">
                    Name / Message to include <span className="text-[#C4A8B3]">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder={`e.g., "Happy Birthday, Priya! 🎂"`}
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    className="w-full border border-[#F0DDE4] rounded-xl px-3.5 py-2 text-base sm:text-sm text-[#3A2930] placeholder:text-[#C4A8B3] focus:outline-none focus:border-[#E8A0B8] bg-white shadow-sm"
                  />
                  <p className="text-[11px] sm:text-xs text-[#806B73] mt-1.5">
                    Options: {product.customizationOptions.join(' · ')}
                  </p>
                </div>
              </div>
            )}

            {/* Quantity & Buttons (Desktop & Tablet) */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#F0DDE4] rounded-full h-11 sm:h-12 bg-white shadow-sm">
                  <button 
                    className="px-3.5 sm:px-4 text-[#806B73] hover:text-[#3A2930] transition-colors disabled:opacity-30 touch-manipulation"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <span className="w-8 sm:w-10 text-center font-semibold text-sm sm:text-base text-[#3A2930]">{quantity}</span>
                  <button 
                    className="px-3.5 sm:px-4 text-[#806B73] hover:text-[#3A2930] transition-colors disabled:opacity-30 touch-manipulation"
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
                <span className="text-xs sm:text-sm text-[#806B73]">
                  {product.stock} in stock
                </span>
              </div>
              
              <div className="flex gap-2.5 sm:gap-3">
                <Button 
                  size="lg" 
                  className="flex-1 h-12 text-sm sm:text-base shadow-md" 
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
                <button 
                  onClick={handleWishlist}
                  className="w-12 h-12 rounded-full border border-[#F0DDE4] flex items-center justify-center hover:bg-[#FFF5F8] transition-colors shrink-0 shadow-sm"
                  aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart className={`w-5 h-5 transition-colors ${inWishlist ? 'fill-[#D9536F] text-[#D9536F]' : 'text-[#806B73]'}`} />
                </button>
              </div>

              <Button 
                variant="outline"
                size="lg" 
                className="w-full h-12 text-sm sm:text-base" 
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                Buy Now
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-8">
              {[
                { icon: <Truck className="w-4 h-4" />, text: 'Free shipping above ₹999' },
                { icon: <Clock className="w-4 h-4" />, text: product.processingTime },
                { icon: <ShieldCheck className="w-4 h-4" />, text: 'Quality checked' },
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-1.5 p-2.5 sm:p-3 bg-[#FFF9FB] rounded-xl border border-[#F0DDE4]">
                  <div className="text-[#E8A0B8]">{badge.icon}</div>
                  <p className="text-[10px] sm:text-xs text-[#806B73] leading-tight">{badge.text}</p>
                </div>
              ))}
            </div>

            {/* Accordion */}
            <div className="border-t border-[#F0DDE4] divide-y divide-[#F0DDE4]">
              {accordionItems.map(item => (
                <div key={item.id} className="py-3.5">
                  <button 
                    onClick={() => setOpenAccordion(openAccordion === item.id ? null : item.id)}
                    className="w-full flex justify-between items-center text-left font-serif font-semibold text-sm sm:text-base text-[#3A2930]"
                  >
                    <span>{item.title}</span>
                    <ChevronRight className={`w-4 h-4 text-[#806B73] transition-transform duration-200 ${openAccordion === item.id ? 'rotate-90' : ''}`} />
                  </button>
                  {openAccordion === item.id && (
                    <div className="mt-3 text-xs sm:text-sm text-[#806B73] animate-fadeIn">
                      {item.content}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 sm:mt-24 pt-12 border-t border-[#F0DDE4]">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#3A2930] mb-6 sm:mb-8 text-center sm:text-left">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {relatedProducts.map(rel => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Sticky Bottom Bar for Mobile Devices */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#F0DDE4] p-3 px-4 shadow-2xl flex items-center justify-between gap-3 safe-area-pb">
        <div>
          <span className="block text-xs text-[#806B73]">Price</span>
          <span className="font-bold text-base text-[#3A2930]">{formatCurrency(price)}</span>
        </div>
        <div className="flex items-center gap-2 flex-1 justify-end max-w-[220px]">
          <Button 
            size="sm" 
            className="flex-1 h-11 text-xs rounded-full font-medium shadow-md"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingBag className="w-3.5 h-3.5 mr-1" />
            Add to Cart
          </Button>
          <button 
            onClick={handleWishlist}
            className="w-11 h-11 rounded-full border border-[#F0DDE4] flex items-center justify-center bg-white shrink-0"
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-[#D9536F] text-[#D9536F]' : 'text-[#806B73]'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
