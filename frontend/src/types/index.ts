export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  price: number;
  compareAtPrice?: number;
  salePrice?: number;
  images: string[];
  thumbnail: string;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  materials: string[];
  dimensions: string;
  colors: string[];
  occasion: string[];
  isCustomizable: boolean;
  customizationOptions: string[];
  processingTime: string;
  shippingInfo: string;
  careInstructions: string;
  isFeatured: boolean;
  isBestseller: boolean;
  isNew: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  avatar?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customization?: {
    name?: string;
    message?: string;
    color?: string;
    instructions?: string;
  };
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  email: string;
  phone: string;
  items: CartItem[];
  total: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  shippingAddress: Address;
}

export interface Address {
  fullName: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
}

export interface CustomOrderRequest {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  productType: string;
  occasion: string;
  budget: string;
  requiredDate: string;
  description: string;
  status: 'REQUESTED' | 'UNDER_REVIEW' | 'QUOTE_SENT' | 'CUSTOMER_APPROVED' | 'IN_PRODUCTION' | 'SHIPPED' | 'DELIVERED';
  createdAt: string;
}