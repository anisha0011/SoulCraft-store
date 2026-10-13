import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '../store/useWishlistStore';
import ProductCard from '../components/shop/ProductCard';
import { Button } from '../components/common/Button';

export default function Wishlist() {
  const { items } = useWishlistStore();

  if (items.length === 0) {
    return (
      <div className="bg-[#FFF9FB] min-h-[70vh] flex items-center justify-center py-12">
        <div className="text-center bg-white p-12 rounded-3xl shadow-sm border border-[#F0DDE4] max-w-lg w-full mx-4">
          <div className="w-20 h-20 bg-[#FFF5F8] text-[#E8A0B8] rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#3A2930] mb-4">Your Wishlist is Empty</h2>
          <p className="text-[#806B73] mb-8">Save the items you love by clicking the heart icon on any product.</p>
          <Link to="/shop">
            <Button size="lg" className="w-full">
              Explore Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF9FB] min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#3A2930] mb-2">My Wishlist</h1>
            <p className="text-[#806B73]">You have {items.length} items saved for later.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
