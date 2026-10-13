import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { formatCurrency } from '../../utils/utils';

interface CartSlideoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSlideover({ isOpen, onClose }: CartSlideoverProps) {
  const { items, removeItem, updateQuantity, getCartTotal } = useCartStore();
  const navigate = useNavigate();
  const total = getCartTotal();
  const shipping = total > 999 ? 0 : 99;

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-[#3A2930]/30 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 h-[100dvh] w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F0DDE4]">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-[#E8A0B8]" />
            <h2 className="text-xl font-serif font-bold text-[#3A2930]">Your Cart</h2>
            {items.length > 0 && (
              <span className="bg-[#E8A0B8] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {items.reduce((a, i) => a + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#FFF5F8] text-[#806B73] hover:text-[#3A2930] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free shipping progress */}
        {total > 0 && total < 999 && (
          <div className="px-6 py-3 bg-[#FFF9FB] border-b border-[#F0DDE4]">
            <p className="text-xs text-[#806B73] mb-1.5">
              Add <span className="font-semibold text-[#E8A0B8]">{formatCurrency(999 - total)}</span> more for <strong>Free Shipping!</strong>
            </p>
            <div className="h-1.5 bg-[#F0DDE4] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#E8A0B8] rounded-full transition-all duration-500"
                style={{ width: `${Math.min((total / 999) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
        {total >= 999 && (
          <div className="px-6 py-3 bg-[#F0FFF4] border-b border-[#4F9D69]/30">
            <p className="text-xs text-[#4F9D69] font-semibold">🎉 You've unlocked Free Shipping!</p>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="w-20 h-20 bg-[#FFF5F8] rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-10 h-10 text-[#E8A0B8]" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#3A2930] mb-2">Your cart is empty</h3>
              <p className="text-[#806B73] text-sm mb-6">Add some handmade goodness to your cart!</p>
              <button
                onClick={() => { onClose(); navigate('/shop'); }}
                className="inline-flex items-center gap-2 text-[#E8A0B8] font-medium hover:text-[#C96F91] transition-colors"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#F0DDE4]">
              {items.map((item) => {
                const price = item.product.salePrice || item.product.price;
                return (
                  <div key={`${item.product.id}-${JSON.stringify(item.customization)}`} className="px-6 py-4 flex gap-4">
                    <Link
                      to={`/product/${item.product.slug}`}
                      onClick={onClose}
                      className="w-20 h-24 rounded-xl overflow-hidden bg-[#FFF5F8] shrink-0"
                    >
                      <img src={item.product.thumbnail} alt={item.product.name} className="w-full h-full object-cover" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.product.slug}`}
                        onClick={onClose}
                        className="font-medium text-[#3A2930] hover:text-[#E8A0B8] transition-colors text-sm line-clamp-2 mb-1"
                      >
                        {item.product.name}
                      </Link>
                      {item.customization?.name && (
                        <p className="text-xs text-[#806B73] mb-1">Name: {item.customization.name}</p>
                      )}
                      <p className="text-sm font-semibold text-[#3A2930] mb-3">{formatCurrency(price)}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-[#F0DDE4] rounded-full h-8 bg-white">
                          <button
                            onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                            className="px-2 text-[#806B73] hover:text-[#3A2930] transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium text-[#3A2930]">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 text-[#806B73] hover:text-[#3A2930] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-[#3A2930]">{formatCurrency(price * item.quantity)}</span>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="p-1 text-[#806B73] hover:text-[#D9536F] transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#F0DDE4] p-4 sm:p-6 pb-6 sm:pb-6 space-y-3 sm:space-y-4 bg-white shrink-0">
            <div className="flex justify-between items-center text-xs sm:text-sm text-[#806B73]">
              <span>Subtotal</span>
              <span className="font-medium text-[#3A2930]">{formatCurrency(total)}</span>
            </div>
            <div className="flex justify-between items-center text-xs sm:text-sm text-[#806B73]">
              <span>Shipping</span>
              <span className={shipping === 0 ? 'text-[#4F9D69] font-medium' : 'font-medium text-[#3A2930]'}>
                {shipping === 0 ? 'Free' : formatCurrency(shipping)}
              </span>
            </div>
            <div className="flex justify-between items-center font-bold text-[#3A2930] text-base sm:text-lg pt-2 border-t border-[#F0DDE4]">
              <span>Total</span>
              <span>{formatCurrency(total + shipping)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-[#E8A0B8] text-white h-11 sm:h-12 rounded-full font-medium text-sm sm:text-base hover:bg-[#C96F91] transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              Checkout <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              to="/cart"
              onClick={onClose}
              className="w-full border border-[#F0DDE4] text-[#3A2930] h-10 rounded-full font-medium text-xs sm:text-sm hover:bg-[#FFF5F8] transition-colors flex items-center justify-center"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
