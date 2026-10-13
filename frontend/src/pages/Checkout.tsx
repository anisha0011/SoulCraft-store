import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CheckCircle2, CreditCard, Wallet, Banknote, ChevronDown, ChevronUp, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { ordersApi } from '../api';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { formatCurrency } from '../utils/utils';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid 10-digit phone number required'),
  street: z.string().min(5, 'Street address is required'),
  apartment: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pinCode: z.string().min(6, 'Valid 6-digit PIN code required'),
  country: z.string().min(2, 'Country is required'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [showMobileSummary, setShowMobileSummary] = useState(false);

  const total = getCartTotal();
  const shipping = total > 999 ? 0 : 99;
  const finalTotal = total + shipping;

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { country: 'India' }
  });

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsSubmitting(true);
    try {
      const orderData = {
        customerName: data.fullName,
        email: data.email,
        phone: data.phone,
        items,
        total: finalTotal,
        shippingAddress: {
          fullName: data.fullName,
          street: data.street,
          apartment: data.apartment,
          city: data.city,
          state: data.state,
          pinCode: data.pinCode,
          country: data.country
        }
      };
      
      const newOrder = await ordersApi.createOrder(orderData);
      clearCart();
      navigate(`/order-confirmation/${newOrder.id}`);
    } catch (error) {
      console.error("Checkout failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FFF9FB] min-h-screen py-6 sm:py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <Link to="/cart" className="p-2 rounded-full bg-white border border-[#F0DDE4] text-[#806B73] hover:text-[#3A2930] transition-colors" title="Back to Cart">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#3A2930]">Checkout</h1>
        </div>

        {/* Mobile Expandable Order Summary Dropdown */}
        <div className="lg:hidden mb-6 bg-white rounded-2xl border border-[#F0DDE4] overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => setShowMobileSummary(!showMobileSummary)}
            className="w-full flex items-center justify-between p-4 bg-[#FFF5F8] text-sm font-medium text-[#3A2930]"
          >
            <div className="flex items-center gap-2 text-[#E8A0B8]">
              <ShoppingBag className="w-4 h-4" />
              <span>{showMobileSummary ? 'Hide order summary' : 'Show order summary'}</span>
              {showMobileSummary ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
            <span className="font-bold text-base text-[#3A2930]">{formatCurrency(finalTotal)}</span>
          </button>

          {showMobileSummary && (
            <div className="p-4 border-t border-[#F0DDE4] space-y-3">
              <div className="divide-y divide-[#F0DDE4] max-h-56 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.product.id} className="py-2.5 flex items-center gap-3">
                    <img src={item.product.thumbnail} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover bg-[#FFF5F8]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#3A2930] truncate">{item.product.name}</p>
                      <p className="text-[11px] text-[#806B73]">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-semibold text-[#3A2930]">
                      {formatCurrency((item.product.salePrice || item.product.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-[#F0DDE4] space-y-1.5 text-xs text-[#806B73]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#3A2930] font-medium">{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-[#3A2930] font-medium">{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          
          <div className="lg:w-2/3">
            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
              
              {/* Contact Info */}
              <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-[#F0DDE4]">
                <h2 className="text-lg sm:text-xl font-serif font-semibold text-[#3A2930] mb-4 sm:mb-6">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <Input label="Full Name" placeholder="Priya Sharma" {...register('fullName')} error={errors.fullName?.message} />
                  <Input label="Email Address" type="email" placeholder="priya@example.com" {...register('email')} error={errors.email?.message} />
                  <Input label="Phone Number" type="tel" inputMode="tel" placeholder="9876543210" className="md:col-span-2" {...register('phone')} error={errors.phone?.message} />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-[#F0DDE4]">
                <h2 className="text-lg sm:text-xl font-serif font-semibold text-[#3A2930] mb-4 sm:mb-6">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <Input label="Street Address" className="md:col-span-2" placeholder="123 Main St" {...register('street')} error={errors.street?.message} />
                  <Input label="Apartment, suite, etc. (optional)" className="md:col-span-2" placeholder="Apt 4B" {...register('apartment')} error={errors.apartment?.message} />
                  <Input label="City" placeholder="Mumbai" {...register('city')} error={errors.city?.message} />
                  <Input label="State" placeholder="Maharashtra" {...register('state')} error={errors.state?.message} />
                  <Input label="PIN Code" inputMode="numeric" placeholder="400001" {...register('pinCode')} error={errors.pinCode?.message} />
                  <Input label="Country" placeholder="India" {...register('country')} error={errors.country?.message} readOnly />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-[#F0DDE4]">
                <h2 className="text-lg sm:text-xl font-serif font-semibold text-[#3A2930] mb-1 sm:mb-2">Payment</h2>
                <p className="text-[#806B73] text-xs sm:text-sm mb-4 sm:mb-6">All transactions are encrypted and safe.</p>
                
                <div className="space-y-3 sm:space-y-4">
                  <label className={`flex items-center p-3.5 sm:p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'upi' ? 'border-[#E8A0B8] bg-[#FFF5F8]' : 'border-[#F0DDE4]'}`}>
                    <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="mr-3 sm:mr-4 accent-[#E8A0B8]" />
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                        <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-[#3A2930]" />
                      </div>
                      <div>
                        <span className="block font-medium text-xs sm:text-sm text-[#3A2930]">UPI (GPay, PhonePe, Paytm)</span>
                        <span className="text-[11px] sm:text-xs text-[#806B73]">Pay directly via any UPI app</span>
                      </div>
                    </div>
                  </label>
                  
                  <label className={`flex items-center p-3.5 sm:p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-[#E8A0B8] bg-[#FFF5F8]' : 'border-[#F0DDE4]'}`}>
                    <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="mr-3 sm:mr-4 accent-[#E8A0B8]" />
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                        <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-[#3A2930]" />
                      </div>
                      <div>
                        <span className="block font-medium text-xs sm:text-sm text-[#3A2930]">Credit / Debit Card</span>
                        <span className="text-[11px] sm:text-xs text-[#806B73]">Visa, Mastercard, RuPay</span>
                      </div>
                    </div>
                  </label>
                  
                  <label className={`flex items-center p-3.5 sm:p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-[#E8A0B8] bg-[#FFF5F8]' : 'border-[#F0DDE4]'}`}>
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="mr-3 sm:mr-4 accent-[#E8A0B8]" />
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                        <Banknote className="w-4 h-4 sm:w-5 sm:h-5 text-[#3A2930]" />
                      </div>
                      <div>
                        <span className="block font-medium text-xs sm:text-sm text-[#3A2930]">Cash on Delivery</span>
                        <span className="text-[11px] sm:text-xs text-[#806B73]">Pay on arrival</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

            </form>
          </div>

          {/* Desktop Order Summary Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm border border-[#F0DDE4] p-5 sm:p-6 sticky top-24">
              <h3 className="font-serif font-semibold text-[#3A2930] mb-4 text-base sm:text-lg">Order Summary</h3>
              
              <div className="divide-y divide-[#F0DDE4] mb-4 sm:mb-6 max-h-[260px] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.product.id} className="py-2.5 sm:py-3 flex gap-3 sm:gap-4 items-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#FFF5F8] shrink-0 relative overflow-hidden">
                      <img src={item.product.thumbnail} alt={item.product.name} className="w-full h-full object-cover" />
                      <div className="absolute -top-1 -right-1 bg-[#806B73] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-xs sm:text-sm font-medium text-[#3A2930] truncate">{item.product.name}</h4>
                      <p className="text-xs sm:text-sm font-semibold text-[#3A2930]">
                        {formatCurrency((item.product.salePrice || item.product.price) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-6 text-xs sm:text-sm border-t border-[#F0DDE4] pt-4">
                <div className="flex justify-between text-[#806B73]">
                  <span>Subtotal</span>
                  <span className="text-[#3A2930] font-medium">{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between text-[#806B73]">
                  <span>Shipping</span>
                  <span className="text-[#3A2930] font-medium">{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
                </div>
              </div>
              
              <div className="border-t border-[#F0DDE4] pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#3A2930] text-sm sm:text-base">Total</span>
                  <span className="text-xl sm:text-2xl font-bold text-[#3A2930]">{formatCurrency(finalTotal)}</span>
                </div>
              </div>
              
              <Button type="submit" form="checkout-form" size="lg" className="w-full h-12 text-sm sm:text-base" isLoading={isSubmitting}>
                Complete Order
              </Button>
              <p className="text-xs text-center text-[#806B73] mt-3 sm:mt-4 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#4F9D69]" /> Safe & secure checkout
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
