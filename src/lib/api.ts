import { API_BASE_URL } from './constants';
import { User, Product, Order, Category, ApiResponse } from '@/types';

// Helper function for API calls
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'An error occurred',
      };
    }

    return {
      success: data.success || true,
      data: data.user || data.data || data,
      message: data.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    return fetchAPI<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

 register: async (data: {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
  phone?: string;
  address?: string;
  avatar?: File;
}) => {
  const formData = new FormData();

  // REQUIRED fields
  formData.append('name', data.name);
  formData.append('email', data.email);
  formData.append('password', data.password);

  // OPTIONAL fields
  if (data.role) formData.append('role', data.role);
  if (data.phone) formData.append('phone', data.phone);
  if (data.address) formData.append('address', data.address);

  return fetchAPI<{ user: User; token: string }>('/auth/register', {
    method: 'POST',
    body: formData, // IMPORTANT: FormData (multer)
  });
},

  logout: async () => {
    return fetchAPI<void>('/auth/logout', {
      method: 'POST',
    });
  },

  getCurrentUser: async () => {
    return fetchAPI<User>('/auth/profile');
  },
};

// Products API
export const productsAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);

    return fetchAPI<{
      products: Product[];
      total: number;
      page: number;
      totalPages: number;
    }>(`/products?${queryParams.toString()}`);
  },

  getById: async (id: string) => {
    return fetchAPI<Product>(`/products/${id}`);
  },

  create: async (data: Partial<Product>) => {
    return fetchAPI<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Product>) => {
    return fetchAPI<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return fetchAPI<void>(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// Orders API
export const ordersAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    userId?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.userId) queryParams.append('userId', params.userId);

    return fetchAPI<{
      orders: Order[];
      total: number;
      page: number;
      totalPages: number;
    }>(`/orders?${queryParams.toString()}`);
  },

  getById: async (id: string) => {
    return fetchAPI<Order>(`/orders/${id}`);
  },

  create: async (data: {
    items: { productId: string; quantity: number; price: number }[];
    deliveryAddress: string;
    paymentMethod: string;
  }) => {
    return fetchAPI<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateStatus: async (id: string, status: string) => {
    return fetchAPI<Order>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  cancel: async (id: string) => {
    return fetchAPI<Order>(`/orders/${id}/cancel`, {
      method: 'POST',
    });
  },
};

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    return fetchAPI<Category[]>('/categories');
  },

  create: async (data: Partial<Category>) => {
    return fetchAPI<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Category>) => {
    return fetchAPI<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return fetchAPI<void>(`/categories/${id}`, {
      method: 'DELETE',
    });
  },
};

// Users API (Admin only)
export const usersAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    role?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.role) queryParams.append('role', params.role);

    return fetchAPI<{
      users: User[];
      total: number;
      page: number;
      totalPages: number;
    }>(`/users?${queryParams.toString()}`);
  },

  getById: async (id: string) => {
    return fetchAPI<User>(`/users/${id}`);
  },

  update: async (id: string, data: Partial<User>) => {
    return fetchAPI<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return fetchAPI<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};

export const cartAPI = {
  get: (): any[] => {
    if (typeof window === 'undefined') return [];
    const cart = localStorage.getItem('quickcart_cart');
    return cart ? JSON.parse(cart) : [];
  },

  add: (item: { productId: string; product: Product; quantity: number }): any[] => {
    const cart = cartAPI.get();
    const existingItem = cart.find((i: any) => i.productId === item.productId);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      cart.push({
        ...item,
        id: Date.now().toString(),
        price: item.product.price,
      });
    }

    localStorage.setItem('quickcart_cart', JSON.stringify(cart));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cart-updated'));
    }

    return cart;
  },

  update: (itemId: string, quantity: number): any[] => {
    const cart = cartAPI.get();
    const item = cart.find((i: any) => i.id === itemId);
    if (item) {
      item.quantity = quantity;
      localStorage.setItem('quickcart_cart', JSON.stringify(cart));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cart-updated'));
      }
    }
    return cart;
  },

  remove: (itemId: string): any[] => {
    let cart = cartAPI.get();
    cart = cart.filter((i: any) => i.id !== itemId);
    localStorage.setItem('quickcart_cart', JSON.stringify(cart));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cart-updated'));
    }
    return cart;
  },

  clear: (): any[] => {
    localStorage.removeItem('quickcart_cart');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cart-updated'));
    }
    return [];
  },

  getCount: (): number => {
    const cart = cartAPI.get();
    return cart.reduce((total: number, item: any) => total + item.quantity, 0);
  },

  getTotal: (): number => {
    const cart = cartAPI.get();
    return cart.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);
  },
};