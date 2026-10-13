import React, { useState, useEffect } from 'react';
import { User as UserIcon, Package, Heart, Edit3, Settings, LogOut, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { ordersApi, customOrdersApi } from '../api';
import type { Order, CustomOrderRequest } from '../types';
import { formatCurrency } from '../utils/utils';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export default function Account() {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'custom' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [customOrders, setCustomOrders] = useState<CustomOrderRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock login for demo purposes
  const handleLogin = () => {
    login({ id: 'user-1', name: 'Priya Sharma', email: 'priya@example.com', role: 'customer' });
  };

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUserData = async () => {
        setIsLoading(true);
        try {
          const [fetchedOrders, fetchedCustomOrders] = await Promise.all([
            ordersApi.getAll(),
            customOrdersApi.getAll()
          ]);
          setOrders(fetchedOrders);
          setCustomOrders(fetchedCustomOrders);
        } catch (error) {
          console.error("Failed to fetch user data", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUserData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="bg-[#FFF9FB] min-h-[70vh] flex items-center justify-center py-12">
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-[#F0DDE4] max-w-md w-full text-center mx-4">
          <div className="w-20 h-20 bg-[#FFF5F8] text-[#E8A0B8] rounded-full flex items-center justify-center mx-auto mb-6">
            <UserIcon className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#3A2930] mb-4">Welcome Back</h2>
          <p className="text-[#806B73] mb-8">Sign in to view your orders, custom requests, and saved items.</p>
          <Button onClick={handleLogin} size="lg" className="w-full">Sign In (Demo)</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF9FB] min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <div className="flex flex-col md:flex-row items-center gap-6 mb-12 bg-white p-8 rounded-3xl shadow-sm border border-[#F0DDE4]">
          <div className="w-24 h-24 bg-[#E8A0B8] text-white rounded-full flex items-center justify-center text-3xl font-bold font-serif shrink-0">
            {user?.name.charAt(0)}
          </div>
          <div className="text-center md:text-left flex-grow">
            <h1 className="text-3xl font-serif font-bold text-[#3A2930]">{user?.name}</h1>
            <p className="text-[#806B73]">{user?.email}</p>
          </div>
          <div className="shrink-0">
            {user?.role === 'admin' && (
              <Button variant="outline" className="mr-4" onClick={() => window.location.href = '/admin'}>
                Admin Dashboard
              </Button>
            )}
            <Button variant="ghost" className="text-[#D9536F] hover:bg-[#D9536F]/10" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-sm border border-[#F0DDE4] overflow-hidden sticky top-24">
              <nav className="flex flex-col">
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center justify-between p-4 text-left transition-colors \${activeTab === 'orders' ? 'bg-[#FFF5F8] text-[#E8A0B8] border-l-4 border-[#E8A0B8]' : 'text-[#3A2930] hover:bg-[#FFF5F8] border-l-4 border-transparent'}`}
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5" />
                    <span className="font-medium">My Orders</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setActiveTab('custom')}
                  className={`flex items-center justify-between p-4 text-left transition-colors \${activeTab === 'custom' ? 'bg-[#FFF5F8] text-[#E8A0B8] border-l-4 border-[#E8A0B8]' : 'text-[#3A2930] hover:bg-[#FFF5F8] border-l-4 border-transparent'}`}
                >
                  <div className="flex items-center gap-3">
                    <Edit3 className="w-5 h-5" />
                    <span className="font-medium">Custom Requests</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center justify-between p-4 text-left transition-colors \${activeTab === 'profile' ? 'bg-[#FFF5F8] text-[#E8A0B8] border-l-4 border-[#E8A0B8]' : 'text-[#3A2930] hover:bg-[#FFF5F8] border-l-4 border-transparent'}`}
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Account Settings</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </nav>
            </div>
          </div>

          {/* Content area */}
          <div className="lg:w-3/4">
            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl shadow-sm border border-[#F0DDE4] p-8">
                <h2 className="text-2xl font-serif font-bold text-[#3A2930] mb-6">Order History</h2>
                
                {isLoading ? (
                  <p>Loading...</p>
                ) : orders.length > 0 ? (
                  <div className="space-y-6">
                    {orders.map(order => (
                      <div key={order.id} className="border border-[#F0DDE4] rounded-xl overflow-hidden">
                        <div className="bg-[#FFF5F8] p-4 flex flex-wrap justify-between items-center gap-4 border-b border-[#F0DDE4]">
                          <div>
                            <p className="text-sm text-[#806B73]">Order Placed</p>
                            <p className="font-medium text-[#3A2930]">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-[#806B73]">Total</p>
                            <p className="font-medium text-[#3A2930]">{formatCurrency(order.total)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-[#806B73]">Order #</p>
                            <p className="font-medium text-[#3A2930]">{order.id}</p>
                          </div>
                          <div>
                            <Badge variant={order.status === 'DELIVERED' ? 'success' : order.status === 'CANCELLED' ? 'destructive' : 'default'}>
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex flex-col gap-4">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex gap-4 items-center">
                                <div className="w-16 h-16 bg-[#FFF9FB] rounded-lg border border-[#F0DDE4] shrink-0">
                                  <img src={item.product.thumbnail} alt={item.product.name} className="w-full h-full object-cover rounded-lg" />
                                </div>
                                <div className="flex-grow">
                                  <h4 className="font-medium text-[#3A2930] line-clamp-1">{item.product.name}</h4>
                                  <p className="text-sm text-[#806B73]">Qty: {item.quantity}</p>
                                </div>
                                <div className="hidden sm:block">
                                  <Button variant="outline" size="sm" onClick={() => window.location.href = `/product/\${item.product.slug}`}>
                                    View Product
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-[#E8A0B8] mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-medium text-[#3A2930] mb-2">No orders yet</h3>
                    <p className="text-[#806B73]">You haven't placed any orders yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'custom' && (
              <div className="bg-white rounded-2xl shadow-sm border border-[#F0DDE4] p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-serif font-bold text-[#3A2930]">Custom Requests</h2>
                  <Button size="sm" onClick={() => window.location.href = '/custom-orders'}>New Request</Button>
                </div>
                
                {isLoading ? (
                  <p>Loading...</p>
                ) : customOrders.length > 0 ? (
                  <div className="space-y-6">
                    {customOrders.map(request => (
                      <div key={request.id} className="border border-[#F0DDE4] rounded-xl p-6 relative overflow-hidden">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg text-[#3A2930]">{request.productType}</h3>
                            <p className="text-sm text-[#806B73]">Requested on {new Date(request.createdAt).toLocaleDateString()}</p>
                          </div>
                          <Badge variant="outline">{request.status.replace('_', ' ')}</Badge>
                        </div>
                        <p className="text-[#3A2930] text-sm mb-4 line-clamp-2">{request.description}</p>
                        <div className="bg-[#FFF5F8] p-3 rounded-lg text-sm text-[#806B73] inline-block">
                          Request ID: <span className="font-mono font-medium text-[#3A2930]">{request.id}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Edit3 className="w-12 h-12 text-[#E8A0B8] mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-medium text-[#3A2930] mb-2">No custom requests</h3>
                    <p className="text-[#806B73]">You haven't made any custom order requests.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-sm border border-[#F0DDE4] p-8">
                <h2 className="text-2xl font-serif font-bold text-[#3A2930] mb-6">Account Settings</h2>
                <div className="max-w-md space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#806B73] mb-1">Full Name</label>
                    <p className="font-medium text-[#3A2930]">{user?.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#806B73] mb-1">Email Address</label>
                    <p className="font-medium text-[#3A2930]">{user?.email}</p>
                  </div>
                  <Button variant="outline">Edit Profile</Button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
