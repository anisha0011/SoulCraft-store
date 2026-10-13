import type { Product, Category, Order, CustomOrderRequest, User } from '../types';
import { DEMO_PRODUCTS, DEMO_CATEGORIES, DEMO_ORDERS } from '../data/demo';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const STORAGE_KEYS = {
  PRODUCTS: 'soulcraft_products',
  CATEGORIES: 'soulcraft_categories',
  ORDERS: 'soulcraft_orders',
  CUSTOM_ORDERS: 'soulcraft_custom_orders',
  USERS: 'soulcraft_users',
  CURRENT_USER: 'soulcraft_current_user'
};

// Initialize LocalStorage with demo data if empty
export const initializeData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEMO_PRODUCTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEMO_CATEGORIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(DEMO_ORDERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CUSTOM_ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_ORDERS, JSON.stringify([]));
  }
  
  // Set a mock admin user
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const adminUser: User = { id: 'admin-1', name: 'Admin', email: 'admin@soulcraft.com', role: 'admin' };
    const customerUser: User = { id: 'user-1', name: 'Priya Sharma', email: 'priya@example.com', role: 'customer' };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([adminUser, customerUser]));
  }
};

// Products API
export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    await delay(500);
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  },
  getById: async (id: string): Promise<Product | undefined> => {
    await delay(300);
    const products = await productsApi.getAll();
    return products.find(p => p.id === id);
  },
  getBySlug: async (slug: string): Promise<Product | undefined> => {
    await delay(300);
    const products = await productsApi.getAll();
    return products.find(p => p.slug === slug);
  },
  getFeatured: async (): Promise<Product[]> => {
    await delay(400);
    const products = await productsApi.getAll();
    return products.filter(p => p.isFeatured && p.isActive);
  },
  getBestsellers: async (): Promise<Product[]> => {
    await delay(400);
    const products = await productsApi.getAll();
    return products.filter(p => p.isBestseller && p.isActive);
  }
};

// Categories API
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    await delay(300);
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : [];
  }
};

// Orders API
export const ordersApi = {
  createOrder: async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> => {
    await delay(1000);
    const orders = await ordersApi.getAll();
    const newOrder: Order = {
      ...orderData,
      id: `SC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([newOrder, ...orders]));
    return newOrder;
  },
  getAll: async (): Promise<Order[]> => {
    await delay(600);
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return data ? JSON.parse(data) : [];
  },
  getById: async (id: string): Promise<Order | undefined> => {
    await delay(300);
    const orders = await ordersApi.getAll();
    return orders.find(o => o.id === id);
  }
};

// Custom Orders API
export const customOrdersApi = {
  create: async (request: Omit<CustomOrderRequest, 'id' | 'createdAt' | 'status'>): Promise<CustomOrderRequest> => {
    await delay(1000);
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_ORDERS);
    const customOrders = data ? JSON.parse(data) : [];
    
    const newRequest: CustomOrderRequest = {
      ...request,
      id: `SC-CUSTOM-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'REQUESTED',
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEYS.CUSTOM_ORDERS, JSON.stringify([newRequest, ...customOrders]));
    return newRequest;
  },
  getAll: async (): Promise<CustomOrderRequest[]> => {
    await delay(600);
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_ORDERS);
    return data ? JSON.parse(data) : [];
  }
};
