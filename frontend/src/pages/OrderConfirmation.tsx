import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Truck, Package, MapPin } from 'lucide-react';
import { ordersApi } from '../api';
import type { Order } from '../types';
import { Button } from '../components/common/Button';
import { formatCurrency } from '../utils/utils';

export default function OrderConfirmation() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const data = await ordersApi.getById(id);
        if (data) {
          setOrder(data);
        }
      } catch (error) {
        console.error("Failed to fetch order", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-serif text-[#3A2930] mb-4">Order Not Found</h2>
        <Link to="/"><Button>Return Home</Button></Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF9FB] min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-3xl shadow-sm border border-[#F0DDE4] p-8 md:p-12 mb-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#E8A0B8]"></div>
          <div className="w-20 h-20 bg-[#FCE7EF] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-[#E8A0B8]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#3A2930] mb-2">Thank you for supporting handmade 💗</h1>
          <p className="text-[#806B73] mb-8 text-lg">Your order has been placed successfully. We'll start crafting it soon.</p>
          
          <div className="bg-[#FFF5F8] inline-block px-8 py-4 rounded-2xl mb-8 border border-[#F0DDE4]">
            <p className="text-sm text-[#806B73] mb-1">Order Number</p>
            <p className="text-xl font-bold font-mono text-[#3A2930]">{order.id}</p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/track-order">
              <Button className="w-full sm:w-auto">Track Order</Button>
            </Link>
            <Link to="/shop">
              <Button variant="outline" className="w-full sm:w-auto">Continue Shopping</Button>
            </Link>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#F0DDE4] p-8">
          <h2 className="text-xl font-serif font-bold text-[#3A2930] mb-6 border-b border-[#F0DDE4] pb-4">Order Details</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-5 h-5 text-[#806B73]" />
                <div>
                  <h4 className="font-semibold text-[#3A2930]">Delivery Address</h4>
                  <p className="text-[#806B73] text-sm mt-1">
                    {order.shippingAddress.fullName}<br/>
                    {order.shippingAddress.street}<br/>
                    {order.shippingAddress.apartment && <>{order.shippingAddress.apartment}<br/></>}
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pinCode}<br/>
                    {order.shippingAddress.country}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-start gap-3 mb-4">
                <Truck className="w-5 h-5 text-[#806B73]" />
                <div>
                  <h4 className="font-semibold text-[#3A2930]">Estimated Delivery</h4>
                  <p className="text-[#806B73] text-sm mt-1">5-7 Business Days</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-[#806B73]" />
                <div>
                  <h4 className="font-semibold text-[#3A2930]">Payment Status</h4>
                  <p className="text-[#4F9D69] font-medium text-sm mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Paid Successfully
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#F0DDE4] pt-6">
            <h4 className="font-semibold text-[#3A2930] mb-4">Items Ordered</h4>
            <div className="space-y-4 mb-6">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#FFF5F8] rounded flex-shrink-0 border border-[#F0DDE4]">
                      <img src={item.product.thumbnail} alt={item.product.name} className="w-full h-full object-cover rounded" />
                    </div>
                    <div>
                      <p className="font-medium text-[#3A2930]">{item.product.name}</p>
                      <p className="text-[#806B73]">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="font-medium text-[#3A2930]">
                    {formatCurrency((item.product.salePrice || item.product.price) * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-[#F0DDE4]">
              <span className="font-bold text-[#3A2930]">Total</span>
              <span className="font-bold text-lg text-[#3A2930]">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
