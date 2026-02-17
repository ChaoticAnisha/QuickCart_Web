export type UserRole = 'admin' | 'user';  

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  address?: string;
  phone?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  deliveryTime: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  user?: User;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  deliveryAddress: string;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled';

export interface Category {
  id: string;
  name: string;
  image: string;
  description?: string;
  productsCount?: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: Order[];
  topProducts: Product[];
}