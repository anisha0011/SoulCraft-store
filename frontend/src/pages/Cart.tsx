import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { Button } from '../components/common/Button';
import { formatCurrency } from '../utils/utils';

export default function Cart() {
  const { items, removeItem, updateQuantity, getCartTotal } = useCartStore();
  const navigate = useNavigate();

  const total = getCartTotal();
  const shipping = total > 999 ? 0 : 99;
  const finalTotal = total > 0 ? total + shipping : 0;

  if (items.length === 0) {
    return (
      <div className="bg-[#FFF9FB] min-h-[70vh] flex items-center justify-center py-12">
        <div className="text-center bg-white p-12 rounded-3xl shadow-sm border border-[#F0DDE4] max-w-lg w-full mx-4">
          <div className="w-20 h-20 bg-[#FFF5F8] text-[#E8A0B8] rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#3A2930] mb-4">Your Cart is Empty</h2>
          <p className="text-[#806B73] mb-8">Looks like you haven't added any handmade goodness to your cart yet.</p>
          <Button onClick={() => navigate('/shop')} size="lg" className="w-full">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF9FB] min-h-screen py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#3A2930] mb-8">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-sm border border-[#F0DDE4] overflow-hidden">
              <div className="p-6 hidden sm:grid grid-cols-12 gap-4 border-b border-[#F0DDE4] bg-[#FFF5F8] text-sm font-medium text-[#3A2930]">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
                <div className="col-span-1"></div>
              </div>
              
              <div className="divide-y divide-[#F0DDE4]">
                {items.map((item) => {
                  const price = item.product.salePrice || item.product.price;
                  return (
                    <div key={`${item.product.id}-${JSON.stringify(item.customization)}`} className="p-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      <div className="col-span-1 sm:col-span-6 flex gap-4">
                        <Link to={`/product/${item.product.slug}`} className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-[#FFF5F8]">
                          <img src={item.product.thumbnail} alt={item.product.name} className="w-full h-full object-cover" />
                        </Link>
                        <div className="flex flex-col justify-center">
                          <Link to={`/product/${item.product.slug}`} className="font-medium text-[#3A2930] hover:text-[#E8A0B8] transition-colors line-clamp-2 mb-1">
                            {item.product.name}
                          </Link>
                          <span className="text-[#806B73] text-sm mb-2">{formatCurrency(price)}</span>
                          
                          {item.customization && (
                            <div className="text-xs text-[#806B73] bg-[#FFF5F8] p-2 rounded">
                              <span className="font-medium">Customization: </span>
                              {item.customization.name && <span>Name: {item.customization.name} </span>}
                              {item.customization.color && <span>Color: {item.customization.color}</span>}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="col-span-1 sm:col-span-3 flex sm:justify-center items-center mt-2 sm:mt-0">
                        <div className="flex items-center border border-[#F0DDE4] rounded-full h-10 bg-white">
                          <button 
                            className="px-3 text-[#806B73] hover:text-[#3A2930] transition-colors"
                            onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          >-</button>
                          <span className="w-6 text-center text-sm font-medium text-[#3A2930]">{item.quantity}</span>
                          <button 
                            className="px-3 text-[#806B73] hover:text-[#3A2930] transition-colors"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >+</button>
                        </div>
                      </div>
                      
                      <div className="col-span-1 sm:col-span-2 text-left sm:text-right font-medium text-[#3A2930] mt-2 sm:mt-0">
                        {formatCurrency(price * item.quantity)}
                      </div>
                      
                      <div className="col-span-1 sm:col-span-1 text-right mt-2 sm:mt-0">
                        <button 
                          onClick={() => removeItem(item.product.id)}
                          className="p-2 text-[#806B73] hover:text-[#D9536F] transition-colors rounded-full hover:bg-[#FFF5F8]"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm border border-[#F0DDE4] p-6 lg:p-8 sticky top-24">
              <h3 className="text-xl font-serif font-semibold text-[#3A2930] mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between text-[#806B73]">
                  <span>Subtotal</span>
                  <span className="text-[#3A2930] font-medium">{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between text-[#806B73]">
                  <span>Shipping</span>
                  <span className="text-[#3A2930] font-medium">
                    {shipping === 0 ? <span className="text-[#4F9D69]">Free</span> : formatCurrency(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-[#E8A0B8]">Add {formatCurrency(999 - total)} more to get free shipping!</p>
                )}
              </div>
              
              <div className="border-t border-[#F0DDE4] pt-6 mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-[#3A2930]">Total</span>
                  <span className="text-2xl font-bold text-[#3A2930]">{formatCurrency(finalTotal)}</span>
                </div>
                <p className="text-xs text-[#806B73] text-right">Inclusive of all taxes</p>
              </div>
              
              <Button onClick={() => navigate('/checkout')} size="lg" className="w-full flex items-center justify-center gap-2">
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Button>
              
              <div className="mt-4 text-center">
                <Link to="/shop" className="text-sm text-[#806B73] hover:text-[#E8A0B8] font-medium transition-colors">
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
