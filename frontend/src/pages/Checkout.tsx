import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CheckCircle2, CreditCard, Wallet, Banknote } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { ordersApi } from '../api';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { formatCurrency } from '../utils/utils';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number required'),
  street: z.string().min(5, 'Street address is required'),
  apartment: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pinCode: z.string().min(6, 'Valid PIN code required'),
  country: z.string().min(2, 'Country is required'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');

  const total = getCartTotal();
  const shipping = total > 999 ? 0 : 99;
  const finalTotal = total + shipping;

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { country: 'India' }
  });

  // Redirect if cart is empty
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
      navigate(`/order-confirmation/\${newOrder.id}`);
    } catch (error) {
      console.error("Checkout failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FFF9FB] min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#3A2930] mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="lg:w-2/3">
            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Contact Info */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#F0DDE4]">
                <h2 className="text-xl font-serif font-semibold text-[#3A2930] mb-6">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Full Name" placeholder="Priya Sharma" {...register('fullName')} error={errors.fullName?.message} />
                  <Input label="Email Address" type="email" placeholder="priya@example.com" {...register('email')} error={errors.email?.message} />
                  <Input label="Phone Number" type="tel" placeholder="9876543210" className="md:col-span-2" {...register('phone')} error={errors.phone?.message} />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#F0DDE4]">
                <h2 className="text-xl font-serif font-semibold text-[#3A2930] mb-6">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Street Address" className="md:col-span-2" placeholder="123 Main St" {...register('street')} error={errors.street?.message} />
                  <Input label="Apartment, suite, etc. (optional)" className="md:col-span-2" placeholder="Apt 4B" {...register('apartment')} error={errors.apartment?.message} />
                  <Input label="City" placeholder="Mumbai" {...register('city')} error={errors.city?.message} />
                  <Input label="State" placeholder="Maharashtra" {...register('state')} error={errors.state?.message} />
                  <Input label="PIN Code" placeholder="400001" {...register('pinCode')} error={errors.pinCode?.message} />
                  <Input label="Country" placeholder="India" {...register('country')} error={errors.country?.message} readOnly />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#F0DDE4]">
                <h2 className="text-xl font-serif font-semibold text-[#3A2930] mb-2">Payment</h2>
                <p className="text-[#806B73] text-sm mb-6">All transactions are secure and encrypted.</p>
                
                <div className="space-y-4">
                  <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors \${paymentMethod === 'upi' ? 'border-[#E8A0B8] bg-[#FFF5F8]' : 'border-[#F0DDE4]'}`}>
                    <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="mr-4 accent-[#E8A0B8]" />
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <Wallet className="w-5 h-5 text-[#3A2930]" />
                      </div>
                      <div>
                        <span className="block font-medium text-[#3A2930]">UPI (GPay, PhonePe, Paytm)</span>
                        <span className="text-xs text-[#806B73]">Pay easily using your UPI app</span>
                      </div>
                    </div>
                  </label>
                  
                  <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors \${paymentMethod === 'card' ? 'border-[#E8A0B8] bg-[#FFF5F8]' : 'border-[#F0DDE4]'}`}>
                    <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="mr-4 accent-[#E8A0B8]" />
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <CreditCard className="w-5 h-5 text-[#3A2930]" />
                      </div>
                      <div>
                        <span className="block font-medium text-[#3A2930]">Credit / Debit Card</span>
                        <span className="text-xs text-[#806B73]">Visa, Mastercard, RuPay</span>
                      </div>
                    </div>
                  </label>
                  
                  <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors \${paymentMethod === 'cod' ? 'border-[#E8A0B8] bg-[#FFF5F8]' : 'border-[#F0DDE4]'}`}>
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="mr-4 accent-[#E8A0B8]" />
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <Banknote className="w-5 h-5 text-[#3A2930]" />
                      </div>
                      <div>
                        <span className="block font-medium text-[#3A2930]">Cash on Delivery</span>
                        <span className="text-xs text-[#806B73]">Pay when you receive your order</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

            </form>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm border border-[#F0DDE4] p-6 sticky top-24">
              <h3 className="font-serif font-semibold text-[#3A2930] mb-4">Order Summary</h3>
              
              <div className="divide-y divide-[#F0DDE4] mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.product.id} className="py-3 flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-md bg-[#FFF5F8] shrink-0 relative overflow-hidden">
                      <img src={item.product.thumbnail} alt={item.product.name} className="w-full h-full object-cover" />
                      <div className="absolute -top-1 -right-1 bg-[#806B73] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-sm font-medium text-[#3A2930] line-clamp-1">{item.product.name}</h4>
                      <p className="text-sm font-semibold text-[#3A2930]">{formatCurrency((item.product.salePrice || item.product.price) * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 mb-6 text-sm border-t border-[#F0DDE4] pt-4">
                <div className="flex justify-between text-[#806B73]">
                  <span>Subtotal</span>
                  <span className="text-[#3A2930] font-medium">{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between text-[#806B73]">
                  <span>Shipping</span>
                  <span className="text-[#3A2930] font-medium">{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
                </div>
              </div>
              
              <div className="border-t border-[#F0DDE4] pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#3A2930] text-lg">Total</span>
                  <span className="text-2xl font-bold text-[#3A2930]">{formatCurrency(finalTotal)}</span>
                </div>
              </div>
              
              <Button type="submit" form="checkout-form" size="lg" className="w-full" isLoading={isSubmitting}>
                Complete Order
              </Button>
              <p className="text-xs text-center text-[#806B73] mt-4 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#4F9D69]" /> Safe & secure checkout
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
