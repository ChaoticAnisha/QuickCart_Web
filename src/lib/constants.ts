export const APP_NAME = 'QuickCart';
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Client Routes
  CLIENT_DASHBOARD: '/dashboard',
  PRODUCTS: '/products',
  CART: '/cart',
  ORDERS: '/orders',
  PROFILE: '/profile',
  
  // Admin Routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_USERS: '/admin/users',
  ADMIN_CATEGORIES: '/admin/categories',
} as const;

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export const ORDER_STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const ORDER_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
  processing: 'bg-purple-100 text-purple-800 border-purple-300',
  out_for_delivery: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  delivered: 'bg-green-100 text-green-800 border-green-300',
  cancelled: 'bg-red-100 text-red-800 border-red-300',
};

export const PAYMENT_METHODS = ['Cash on Delivery', 'Khalti', 'eSewa'] as const;

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
};

export const NEPALI_ADDRESSES = [
  'Kathmandu, Nepal',
  'Pokhara, Nepal',
  'Lalitpur, Nepal',
  'Bhaktapur, Nepal',
  'Biratnagar, Nepal',
  'Birgunj, Nepal',
] as const;

export const CATEGORIES = [
  { id: '1', name: 'Lights, Diyas & Candles', image: 'image 50.png' },
  { id: '2', name: 'Diwali Gifts', image: 'image 51.png' },
  { id: '3', name: 'Appliances & Gadgets', image: 'image 52.png' },
  { id: '4', name: 'Home & Living', image: 'image 53.png' },
  { id: '5', name: 'Vegetables & Fruits', image: 'image 41.png' },
  { id: '6', name: 'Atta, Dal & Rice', image: 'image 42.png' },
  { id: '7', name: 'Oil, Ghee & Masala', image: 'image 43.png' },
  { id: '8', name: 'Dairy, Bread & Milk', image: 'image 44 (1).png' },
];