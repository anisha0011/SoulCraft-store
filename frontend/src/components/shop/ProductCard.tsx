import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
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
    <div className="group relative flex flex-col bg-white rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-[#FCE7EF]/50 border border-transparent hover:border-[#F0DDE4] overflow-hidden">
      
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.isNew && <Badge variant="success">NEW</Badge>}
        {product.isBestseller && <Badge variant="secondary">BESTSELLER</Badge>}
        {isDiscounted && (
          <Badge variant="destructive">
            {Math.round((1 - (product.salePrice! / product.price)) * 100)}% OFF
          </Badge>
        )}
      </div>

      {/* Wishlist Button */}
      <button 
        onClick={handleWishlistToggle}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur shadow-sm hover:bg-white transition-colors text-[#806B73] hover:text-[#D9536F]"
      >
        <Heart className={`h-5 w-5 ${inWishlist ? 'fill-[#D9536F] text-[#D9536F]' : ''}`} />
      </button>

      <Link to={`/product/${product.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-[#FFF5F8]">
        {/* Main Image */}
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
        />
        {/* Secondary Image on Hover */}
        {product.images[1] && (
          <img 
            src={product.images[1]} 
            alt={`${product.name} alternate view`}
            className="absolute inset-0 object-cover w-full h-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        
        {/* Hover Actions Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-gradient-to-t from-black/50 to-transparent flex gap-2">
          {product.isCustomizable ? (
             <Link 
              to={`/product/${product.slug}`}
              className="flex-1 bg-white text-[#3A2930] h-10 rounded-full flex items-center justify-center font-medium text-sm hover:bg-[#FFF5F8] transition-colors"
             >
               Customize
             </Link>
          ) : (
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-white text-[#3A2930] h-10 rounded-full flex items-center justify-center font-medium text-sm hover:bg-[#FFF5F8] transition-colors"
            >
              <ShoppingBag className="h-4 w-4 mr-2" /> Add to Cart
            </button>
          )}
          <Link 
            to={`/product/${product.slug}`}
            className="w-10 h-10 bg-white text-[#3A2930] rounded-full flex items-center justify-center hover:bg-[#FFF5F8] transition-colors shrink-0"
          >
            <Eye className="h-4 w-4" />
          </Link>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-serif font-medium text-[#3A2930] text-lg mb-1 line-clamp-1 group-hover:text-[#E8A0B8] transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-[#806B73] mb-3 line-clamp-1">
          {product.shortDescription}
        </p>
        
        <div className="mt-auto flex items-end justify-between">
          <div>
            {isDiscounted ? (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#3A2930]">{formatCurrency(price)}</span>
                <span className="text-sm text-[#806B73] line-through">{formatCurrency(product.price)}</span>
              </div>
            ) : (
              <span className="font-semibold text-[#3A2930]">{formatCurrency(price)}</span>
            )}
          </div>
          
          <div className="flex items-center text-xs text-[#806B73]">
            <span className="text-[#F5A623] mr-1">★</span>
            {product.rating} ({product.reviewCount})
          </div>
        </div>
      </div>
    </div>
  );
}
