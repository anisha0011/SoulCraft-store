import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { Button } from '../components/common/Button';
import { formatCurrency } from '../utils/utils';
import { toast } from '../store/useToastStore';

export default function Cart() {
  const { items, removeItem, updateQuantity, getCartTotal } = useCartStore();
  const navigate = useNavigate();

  const total = getCartTotal();
  const shipping = total > 999 ? 0 : 99;
  const finalTotal = total > 0 ? total + shipping : 0;

  if (items.length === 0) {
    return (
      <div className="bg-[#FFF9FB] min-h-[70vh] flex items-center justify-center py-12 px-4">
        <div className="text-center bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-[#F0DDE4] max-w-lg w-full">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#FFF5F8] text-[#E8A0B8] rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6">
            <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#3A2930] mb-3 sm:mb-4">Your Cart is Empty</h2>
          <p className="text-xs sm:text-base text-[#806B73] mb-6 sm:mb-8">Looks like you haven't added any handmade goodness to your cart yet.</p>
          <Button onClick={() => navigate('/shop')} size="lg" className="w-full">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF9FB] min-h-screen py-6 sm:py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#3A2930] mb-6 sm:mb-8">
          Shopping Cart ({items.reduce((a, i) => a + i.quantity, 0)})
        </h1>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* Cart Items List */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-sm border border-[#F0DDE4] overflow-hidden">
              <div className="p-4 sm:p-6 hidden sm:grid grid-cols-12 gap-4 border-b border-[#F0DDE4] bg-[#FFF5F8] text-sm font-medium text-[#3A2930]">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
                <div className="col-span-1"></div>
              </div>
              
              <div className="divide-y divide-[#F0DDE4]">
                {items.map((item) => {
                  const price = item.product.salePrice || item.product.price;
                  return (
                    <div key={`${item.product.id}-${JSON.stringify(item.customization)}`} className="p-4 sm:p-6 flex flex-col sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center">
                      {/* Product Info */}
                      <div className="sm:col-span-6 flex gap-3 sm:gap-4">
                        <Link to={`/product/${item.product.slug}`} className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-[#FFF5F8]">
                          <img src={item.product.thumbnail} alt={item.product.name} className="w-full h-full object-cover" />
                        </Link>
                        <div className="flex flex-col justify-center min-w-0 flex-1">
                          <Link to={`/product/${item.product.slug}`} className="font-medium text-[#3A2930] hover:text-[#E8A0B8] transition-colors text-sm sm:text-base line-clamp-2 mb-1">
                            {item.product.name}
                          </Link>
                          <span className="text-[#806B73] text-xs sm:text-sm mb-1.5">{formatCurrency(price)} each</span>
                          
                          {item.customization?.name && (
                            <div className="text-xs text-[#806B73] bg-[#FFF5F8] p-1.5 sm:p-2 rounded-lg truncate">
                              <span className="font-medium text-[#3A2930]">Custom: </span>
                              {item.customization.name}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Controls Row (Mobile bottom bar, Desktop table cols) */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F0DDE4]/50 sm:border-0 sm:mt-0 sm:pt-0 sm:col-span-6 sm:grid sm:grid-cols-6 sm:items-center">
                        {/* Stepper */}
                        <div className="sm:col-span-3 sm:flex sm:justify-center">
                          <div className="flex items-center border border-[#F0DDE4] rounded-full h-9 sm:h-10 bg-white">
                            <button 
                              className="px-2.5 sm:px-3 text-[#806B73] hover:text-[#3A2930] transition-colors"
                              onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                            >-</button>
                            <span className="w-6 text-center text-xs sm:text-sm font-medium text-[#3A2930]">{item.quantity}</span>
                            <button 
                              className="px-2.5 sm:px-3 text-[#806B73] hover:text-[#3A2930] transition-colors"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >+</button>
                          </div>
                        </div>
                        
                        {/* Total Price */}
                        <div className="sm:col-span-2 text-right font-semibold text-sm sm:text-base text-[#3A2930]">
                          {formatCurrency(price * item.quantity)}
                        </div>
                        
                        {/* Remove */}
                        <div className="sm:col-span-1 text-right">
                          <button 
                            onClick={() => {
                              removeItem(item.product.id);
                              toast.info('Item Removed', `${item.product.name} was removed from your cart.`);
                            }}
                            className="p-1.5 sm:p-2 text-[#806B73] hover:text-[#D9536F] transition-colors rounded-full hover:bg-[#FFF5F8]"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm border border-[#F0DDE4] p-5 sm:p-8 sticky top-24">
              <h3 className="text-lg sm:text-xl font-serif font-semibold text-[#3A2930] mb-4 sm:mb-6">Order Summary</h3>
              
              <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6 text-xs sm:text-sm">
                <div className="flex justify-between text-[#806B73]">
                  <span>Subtotal</span>
                  <span className="text-[#3A2930] font-medium">{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between text-[#806B73]">
                  <span>Shipping</span>
                  <span className="text-[#3A2930] font-medium">
                    {shipping === 0 ? <span className="text-[#4F9D69] font-bold">Free</span> : formatCurrency(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-[11px] text-[#E8A0B8]">Add {formatCurrency(999 - total)} more for free shipping!</p>
                )}
              </div>
              
              <div className="border-t border-[#F0DDE4] pt-4 sm:pt-6 mb-6 sm:mb-8">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-sm sm:text-base text-[#3A2930]">Total</span>
                  <span className="text-xl sm:text-2xl font-bold text-[#3A2930]">{formatCurrency(finalTotal)}</span>
                </div>
                <p className="text-[11px] text-[#806B73] text-right">Inclusive of all taxes</p>
              </div>
              
              <Button onClick={() => navigate('/checkout')} size="lg" className="w-full flex items-center justify-center gap-2 h-12 text-sm sm:text-base">
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Button>
              
              <div className="mt-4 text-center">
                <Link to="/shop" className="text-xs sm:text-sm text-[#806B73] hover:text-[#E8A0B8] font-medium transition-colors">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
