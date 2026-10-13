import React, { useState } from 'react';
import { Search, Package, CheckCircle2, Circle } from 'lucide-react';
import { ordersApi } from '../api';
import type { Order } from '../types';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { cn } from '../utils/utils';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    
    setIsLoading(true);
    setError('');
    try {
      const data = await ordersApi.getById(orderId);
      if (data) {
        setOrder(data);
      } else {
        setOrder(null);
        setError('No order found with this ID. Please check and try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIndex = (status: Order['status']) => {
    const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    return statuses.indexOf(status);
  };

  const currentStatusIndex = order ? getStatusIndex(order.status) : -1;

  const steps = [
    { label: 'Order Placed', desc: 'We have received your order.' },
    { label: 'Crafting & Processing', desc: 'Your handmade item is being created.' },
    { label: 'Shipped', desc: 'Your order is on the way.' },
    { label: 'Delivered', desc: 'Delivered to your address.' }
  ];

  return (
    <div className="bg-[#FFF9FB] min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-[#FFF5F8] text-[#E8A0B8] rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#3A2930] mb-4">Track Your Order</h1>
          <p className="text-[#806B73]">Enter your order ID to check the current status of your handmade items.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#F0DDE4] mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <Input 
                placeholder="e.g. SC-2026-123456" 
                value={orderId} 
                onChange={(e) => setOrderId(e.target.value)} 
                error={error}
              />
            </div>
            <Button type="submit" isLoading={isLoading} className="h-11 sm:w-auto w-full flex items-center gap-2">
              <Search className="w-4 h-4" /> Track
            </Button>
          </form>
        </div>

        {order && order.status !== 'CANCELLED' && (
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-[#F0DDE4]">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-[#F0DDE4]">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#3A2930]">Order {order.id}</h3>
                <p className="text-[#806B73] text-sm mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="bg-[#FFF5F8] text-[#E8A0B8] px-4 py-2 rounded-full font-medium text-sm">
                {order.status}
              </div>
            </div>

            <div className="relative">
              {/* Connecting Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#F0DDE4] md:left-auto md:right-auto md:top-6 md:bottom-auto md:w-full md:h-0.5 z-0"></div>
              
              <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-4 relative z-10">
                {steps.map((step, idx) => {
                  const isCompleted = idx <= currentStatusIndex;
                  const isCurrent = idx === currentStatusIndex;
                  
                  return (
                    <div key={idx} className="flex md:flex-col items-center md:text-center gap-4 md:gap-3 flex-1">
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center border-4 border-white transition-colors duration-500 shrink-0",
                        isCompleted ? "bg-[#E8A0B8] text-white" : "bg-[#F0DDE4] text-[#806B73]",
                        isCurrent && "ring-4 ring-[#FCE7EF]"
                      )}>
                        {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-4 h-4" />}
                      </div>
                      <div>
                        <h4 className={cn("font-semibold mb-1", isCompleted ? "text-[#3A2930]" : "text-[#806B73]")}>
                          {step.label}
                        </h4>
                        <p className="text-xs text-[#806B73] md:max-w-[120px] mx-auto hidden sm:block">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        
        {order && order.status === 'CANCELLED' && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#D9536F]/30 text-center">
            <h3 className="font-serif font-bold text-xl text-[#D9536F] mb-2">Order Cancelled</h3>
            <p className="text-[#806B73]">This order has been cancelled. Please contact support if you have any questions.</p>
          </div>
        )}
      </div>
    </div>
  );
}
