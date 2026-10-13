import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, ShieldCheck, Truck, Clock } from 'lucide-react';
import { productsApi } from '../api';
import type { Product } from '../types';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { formatCurrency } from '../utils/utils';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [mainImage, setMainImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
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
        } else {
          // navigate('/shop');
        }
      } catch (error) {
        console.error("Error fetching product", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (isLoading) {
    return <div className="min-h-[70vh] flex items-center justify-center">Loading...</div>;
  }

  if (!product) {
    return <div className="min-h-[70vh] flex items-center justify-center flex-col gap-4">
      <h2 className="text-2xl font-serif">Product not found</h2>
      <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
    </div>;
  }

  const inWishlist = isInWishlist(product.id);
  const price = product.salePrice || product.price;
  const isDiscounted = product.salePrice && product.salePrice < product.price;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    // show toast
  };

  const handleWishlist = () => {
    if (inWishlist) removeFromWishlist(product.id);
    else addToWishlist(product);
  };

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Breadcrumbs could go here */}

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Images Section */}
          <div className="lg:w-1/2 flex flex-col-reverse md:flex-row gap-4 h-fit sticky top-24">
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:max-h-[600px] no-scrollbar">
              {product.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setMainImage(idx)}
                  className={`relative shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-colors ${mainImage === idx ? 'border-[#E8A0B8]' : 'border-transparent hover:border-[#F0DDE4]'}`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="flex-grow rounded-2xl overflow-hidden bg-[#FFF5F8] aspect-[4/5] relative">
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {product.isNew && <Badge variant="success">NEW</Badge>}
                {isDiscounted && (
                  <Badge variant="destructive">
                    {Math.round((1 - (product.salePrice! / product.price)) * 100)}% OFF
                  </Badge>
                )}
              </div>
              <img 
                src={product.images[mainImage]} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:w-1/2">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#3A2930] mb-2">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center text-[#F5A623]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-transparent'}`} />
                ))}
              </div>
              <span className="text-sm text-[#806B73]">{product.rating} ({product.reviewCount} reviews)</span>
            </div>

            <div className="mb-6">
              {isDiscounted ? (
                <div className="flex items-end gap-3">
                  <span className="text-3xl font-semibold text-[#3A2930]">{formatCurrency(price)}</span>
                  <span className="text-lg text-[#806B73] line-through mb-1">{formatCurrency(product.price)}</span>
                </div>
              ) : (
                <span className="text-3xl font-semibold text-[#3A2930]">{formatCurrency(price)}</span>
              )}
              <p className="text-xs text-[#806B73] mt-1">Inclusive of all taxes</p>
            </div>

            <p className="text-[#806B73] leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Customization Alert */}
            {product.isCustomizable && (
              <div className="bg-[#FFF5F8] border border-[#F0DDE4] rounded-xl p-4 mb-8">
                <h4 className="font-medium text-[#3A2930] flex items-center gap-2 mb-2">
                  ✨ Custom-made especially for you
                </h4>
                <p className="text-sm text-[#806B73]">
                  This product can be personalized. You can specify names, colors, or special instructions at checkout or via a custom order request.
                </p>
                {/* Note: Full customization form would go here or be a separate modal */}
              </div>
            )}

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-[#F0DDE4] rounded-full h-12 bg-white">
                <button 
                  className="px-4 text-[#806B73] hover:text-[#3A2930] transition-colors"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                >-</button>
                <span className="w-8 text-center font-medium text-[#3A2930]">{quantity}</span>
                <button 
                  className="px-4 text-[#806B73] hover:text-[#3A2930] transition-colors"
                  onClick={() => setQuantity(q => q + 1)}
                >+</button>
              </div>
              
              <Button size="lg" className="flex-grow h-12 text-lg" onClick={handleAddToCart}>
                Add to Cart
              </Button>
              
              <button 
                onClick={handleWishlist}
                className="w-12 h-12 rounded-full border border-[#F0DDE4] flex items-center justify-center hover:bg-[#FFF5F8] transition-colors shrink-0"
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-[#D9536F] text-[#D9536F]' : 'text-[#3A2930]'}`} />
              </button>
            </div>

            {/* Product Meta */}
            <div className="space-y-4 border-t border-[#F0DDE4] pt-8">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-[#806B73] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-medium text-[#3A2930]">Shipping</h5>
                  <p className="text-sm text-[#806B73]">{product.shippingInfo}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#806B73] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-medium text-[#3A2930]">Processing Time</h5>
                  <p className="text-sm text-[#806B73]">{product.processingTime}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#806B73] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-medium text-[#3A2930]">Quality Checked</h5>
                  <p className="text-sm text-[#806B73]">Every piece is manually inspected for perfection.</p>
                </div>
              </div>
            </div>

            {/* Accordions for Details */}
            <div className="mt-8 pt-8 border-t border-[#F0DDE4] space-y-4">
              <div>
                <h4 className="font-medium text-[#3A2930] mb-2">Materials</h4>
                <p className="text-sm text-[#806B73]">{product.materials.join(', ')}</p>
              </div>
              <div>
                <h4 className="font-medium text-[#3A2930] mb-2">Dimensions</h4>
                <p className="text-sm text-[#806B73]">{product.dimensions}</p>
              </div>
              <div>
                <h4 className="font-medium text-[#3A2930] mb-2">Care Instructions</h4>
                <p className="text-sm text-[#806B73]">{product.careInstructions}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
