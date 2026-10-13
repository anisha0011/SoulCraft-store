import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Sparkles } from 'lucide-react';
import type { Product } from '../../types';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { toast } from '../../store/useToastStore';
import { Badge } from '../common/Badge';
import { formatCurrency } from '../../utils/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  
  const inWishlist = isInWishlist(product.id);
  const price = product.salePrice || product.price;
  const isDiscounted = product.salePrice && product.salePrice < product.price;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.info('Removed from Wishlist', `${product.name} removed from your wishlist.`);
    } else {
      addToWishlist(product);
      toast.success('Added to Wishlist', `${product.name} saved to your wishlist.`);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product.isCustomizable) {
      addToCart(product, 1);
      toast.success('Added to Cart', `${product.name} added to your cart.`);
    }
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-[#FCE7EF]/50 border border-[#F0DDE4]/60 hover:border-[#F0DDE4] overflow-hidden">
      
      {/* Badges */}
      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex flex-col gap-1.5">
        {product.isNew && (
          <Badge variant="success" className="text-[10px] sm:text-xs px-2 py-0.5">
            NEW
          </Badge>
        )}
        {product.isBestseller && (
          <Badge variant="secondary" className="text-[10px] sm:text-xs px-2 py-0.5">
            POPULAR
          </Badge>
        )}
        {isDiscounted && (
          <Badge variant="destructive" className="text-[10px] sm:text-xs px-2 py-0.5">
            {Math.round((1 - (product.salePrice! / product.price)) * 100)}% OFF
          </Badge>
        )}
      </div>

      {/* Wishlist Button */}
      <button 
        onClick={handleWishlistToggle}
        className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 p-1.5 sm:p-2 rounded-full bg-white/85 backdrop-blur-sm shadow-sm hover:bg-white transition-colors text-[#806B73] hover:text-[#D9536F] touch-manipulation"
        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${inWishlist ? 'fill-[#D9536F] text-[#D9536F]' : ''}`} />
      </button>

      <Link to={`/product/${product.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-[#FFF5F8]">
        {/* Main Image */}
        <img 
          src={product.images[0]} 
          alt={product.name} 
          loading="lazy"
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
        />
        {/* Secondary Image on Hover */}
        {product.images[1] && (
          <img 
            src={product.images[1]} 
            alt={`${product.name} alternate view`}
            loading="lazy"
            className="absolute inset-0 object-cover w-full h-full opacity-0 transition-opacity duration-500 group-hover:opacity-100 hidden sm:block"
          />
        )}
        
        {/* Desktop Hover Actions Overlay */}
        <div className="hidden sm:flex absolute inset-x-0 bottom-0 p-3 opacity-0 transform translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-gradient-to-t from-black/60 to-transparent gap-2">
          {product.isCustomizable ? (
             <Link 
              to={`/product/${product.slug}`}
              className="flex-1 bg-white text-[#3A2930] h-9 rounded-full flex items-center justify-center font-medium text-xs hover:bg-[#FFF5F8] transition-colors shadow-sm"
             >
               Customize
             </Link>
          ) : (
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-white text-[#3A2930] h-9 rounded-full flex items-center justify-center font-medium text-xs hover:bg-[#FFF5F8] transition-colors shadow-sm"
            >
              <ShoppingBag className="h-3.5 w-3.5 mr-1.5" /> Add to Cart
            </button>
          )}
          <Link 
            to={`/product/${product.slug}`}
            className="w-9 h-9 bg-white text-[#3A2930] rounded-full flex items-center justify-center hover:bg-[#FFF5F8] transition-colors shrink-0 shadow-sm"
            aria-label="View product"
          >
            <Eye className="h-4 w-4" />
          </Link>
        </div>
      </Link>

      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-serif font-medium text-[#3A2930] text-sm sm:text-base mb-1 line-clamp-1 group-hover:text-[#E8A0B8] transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-xs text-[#806B73] mb-2 sm:mb-3 line-clamp-1">
          {product.shortDescription}
        </p>
        
        <div className="mt-auto flex items-center justify-between gap-1 pt-1 border-t border-[#F0DDE4]/40 sm:border-0 sm:pt-0">
          <div>
            {isDiscounted ? (
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1.5">
                <span className="font-semibold text-sm sm:text-base text-[#3A2930]">{formatCurrency(price)}</span>
                <span className="text-[11px] sm:text-xs text-[#806B73] line-through">{formatCurrency(product.price)}</span>
              </div>
            ) : (
              <span className="font-semibold text-sm sm:text-base text-[#3A2930]">{formatCurrency(price)}</span>
            )}
          </div>

          {/* Mobile Touch Quick Action Button */}
          <div className="sm:hidden flex items-center">
            {product.isCustomizable ? (
              <Link
                to={`/product/${product.slug}`}
                className="p-2 rounded-full bg-[#FFF5F8] text-[#E8A0B8] hover:bg-[#E8A0B8] hover:text-white transition-colors"
                title="Customize"
              >
                <Sparkles className="h-4 w-4" />
              </Link>
            ) : (
              <button
                onClick={handleAddToCart}
                className="p-2 rounded-full bg-[#FFF5F8] text-[#E8A0B8] hover:bg-[#E8A0B8] hover:text-white transition-colors"
                title="Add to cart"
              >
                <ShoppingBag className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {/* Desktop Rating */}
          <div className="hidden sm:flex items-center text-xs text-[#806B73]">
            <span className="text-[#F5A623] mr-1">★</span>
            {product.rating} <span className="text-[#C4A8B3] ml-0.5">({product.reviewCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
