import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ShoppingBag, Edit3, Users, Settings, LogOut, Package } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { productsApi, ordersApi, customOrdersApi } from '../api';
import type { Product, Order, CustomOrderRequest } from '../types';
import { formatCurrency } from '../utils/utils';
import { Badge } from '../components/common/Badge';

export default function AdminDashboard() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'custom'>('overview');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customOrders, setCustomOrders] = useState<CustomOrderRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [p, o, c] = await Promise.all([
          productsApi.getAll(),
          ordersApi.getAll(),
          customOrdersApi.getAll()
        ]);
        setProducts(p);
        setOrders(o);
        setCustomOrders(c);
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Simple admin check
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You do not have permission to view this page.</p>
          <a href="/" className="text-[#E8A0B8] hover:underline">Return to Home</a>
        </div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#3A2930] text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-serif font-bold">Soul Craft<span className="text-[#E8A0B8]">.</span></h1>
          <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center px-6 py-3 transition-colors \${activeTab === 'overview' ? 'bg-[#E8A0B8] text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
            <LayoutDashboard className="w-5 h-5 mr-3" /> Overview
          </button>
          <button onClick={() => setActiveTab('products')} className={`w-full flex items-center px-6 py-3 transition-colors \${activeTab === 'products' ? 'bg-[#E8A0B8] text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
            <Package className="w-5 h-5 mr-3" /> Products
          </button>
          <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center px-6 py-3 transition-colors \${activeTab === 'orders' ? 'bg-[#E8A0B8] text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
            <ShoppingBag className="w-5 h-5 mr-3" /> Orders
          </button>
          <button onClick={() => setActiveTab('custom')} className={`w-full flex items-center px-6 py-3 transition-colors \${activeTab === 'custom' ? 'bg-[#E8A0B8] text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
            <Edit3 className="w-5 h-5 mr-3" /> Custom Requests
          </button>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button onClick={() => { logout(); window.location.href = '/'; }} className="flex items-center text-gray-400 hover:text-white transition-colors w-full px-2 py-2">
            <LogOut className="w-5 h-5 mr-3" /> Exit Admin
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-[#3A2930] capitalize">{activeTab}</h2>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#E8A0B8] rounded-full flex items-center justify-center text-white font-bold">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        {isLoading ? (
          <p>Loading data...</p>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#F0DDE4]">
                    <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold text-[#3A2930]">{formatCurrency(totalRevenue)}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#F0DDE4]">
                    <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                    <p className="text-3xl font-bold text-[#3A2930]">{orders.length}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#F0DDE4]">
                    <p className="text-sm text-gray-500 mb-1">Custom Requests</p>
                    <p className="text-3xl font-bold text-[#3A2930]">{customOrders.length}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#F0DDE4]">
                    <p className="text-sm text-gray-500 mb-1">Total Products</p>
                    <p className="text-3xl font-bold text-[#3A2930]">{products.length}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-2xl shadow-sm border border-[#F0DDE4] p-6">
                    <h3 className="font-semibold text-lg mb-4">Recent Orders</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                          <tr>
                            <th className="px-4 py-3">Order ID</th>
                            <th className="px-4 py-3">Customer</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.slice(0, 5).map(order => (
                            <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-900">{order.id}</td>
                              <td className="px-4 py-3">{order.customerName}</td>
                              <td className="px-4 py-3">{formatCurrency(order.total)}</td>
                              <td className="px-4 py-3"><Badge variant="outline">{order.status}</Badge></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-[#F0DDE4] p-6">
                    <h3 className="font-semibold text-lg mb-4">Recent Custom Requests</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                          <tr>
                            <th className="px-4 py-3">Request ID</th>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customOrders.slice(0, 5).map(req => (
                            <tr key={req.id} className="border-b last:border-0 hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-900">{req.id}</td>
                              <td className="px-4 py-3">{req.productType}</td>
                              <td className="px-4 py-3">{new Date(req.createdAt).toLocaleDateString()}</td>
                              <td className="px-4 py-3"><Badge variant="outline">{req.status.replace('_', ' ')}</Badge></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab (Placeholder implementation) */}
            {activeTab === 'products' && (
              <div className="bg-white rounded-2xl shadow-sm border border-[#F0DDE4] overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center">
                  <h3 className="font-semibold text-lg">Product Catalog</h3>
                  <button className="bg-[#E8A0B8] text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-[#C96F91] transition-colors">
                    Add Product
                  </button>
                </div>
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Stock</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img src={product.thumbnail} alt={product.name} className="w-10 h-10 rounded-md object-cover" />
                          <span className="font-medium text-gray-900">{product.name}</span>
                        </td>
                        <td className="px-6 py-4">{formatCurrency(product.price)}</td>
                        <td className="px-6 py-4">
                          <span className={`\${product.stock < product.lowStockThreshold ? 'text-red-500 font-bold' : ''}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={product.isActive ? 'success' : 'secondary'}>{product.isActive ? 'Active' : 'Draft'}</Badge>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-blue-600 hover:underline mr-3">Edit</button>
                          <button className="text-red-600 hover:underline">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Other tabs would follow similarly */}
            {(activeTab === 'orders' || activeTab === 'custom') && (
              <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500 mb-2">Detailed management interface for {activeTab} goes here.</p>
                <p className="text-xs text-gray-400">In a full application, this would include advanced filtering, status updates, and detail views.</p>
              </div>
            )}
            
          </>
        )}
      </main>
    </div>
  );
}
