import axiosInstance from "@/lib/axios";
import { API } from "@/lib/endpoints";

export interface Product {
  _id: string;
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  deliveryTime: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetProductResponse {
  success: boolean;
  product: Product;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  deliveryTime?: string;
  isActive?: boolean;
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  category?: string;
  stock?: number;
  deliveryTime?: string;
  isActive?: boolean;
}

// ✅ Get all products
export async function getAllProducts(
  page: number = 1,
  limit: number = 10,
  search: string = '',
  category?: string
): Promise<GetProductsResponse> {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (search) params.append('search', search);
    if (category) params.append('category', category);

    const response = await axiosInstance.get(`${API.PRODUCTS.GET_ALL}?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
}

// ✅ Get single product
export async function getProductById(id: string): Promise<GetProductResponse> {
  try {
    const response = await axiosInstance.get(API.PRODUCTS.GET_BY_ID(id));
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch product');
  }
}

// ✅ Create product with image upload
export async function createProduct(data: CreateProductPayload, imageFile?: File): Promise<GetProductResponse> {
  try {
    const formData = new FormData();
    
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('stock', data.stock.toString());
    formData.append('category', data.category);
    formData.append('deliveryTime', data.deliveryTime || '16');
    formData.append('isActive', String(data.isActive ?? true));
    
    if (imageFile) {
      // Upload actual image file
      formData.append('image', imageFile);
    } else if (data.image) {
      // ✅ Use image URL/path if provided
      formData.append('image', data.image);
    }

    const response = await axiosInstance.post(API.PRODUCTS.CREATE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create product');
  }
}

// Update product with image upload
export async function updateProduct(id: string, data: UpdateProductPayload, imageFile?: File): Promise<GetProductResponse> {
  try {
    const formData = new FormData();
    
    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.price !== undefined) formData.append('price', data.price.toString());
    if (data.stock !== undefined) formData.append('stock', data.stock.toString());
    if (data.category) formData.append('category', data.category);
    if (data.deliveryTime) formData.append('deliveryTime', data.deliveryTime);
    if (data.isActive !== undefined) formData.append('isActive', String(data.isActive));
    
    if (imageFile) {
      formData.append('image', imageFile);
    } else if (data.image) {
      formData.append('image', data.image);
    }

    const response = await axiosInstance.put(API.PRODUCTS.UPDATE(id), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update product');
  }
}

// Delete product
export async function deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axiosInstance.delete(API.PRODUCTS.DELETE(id));
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete product');
  }
}

// Update stock
export async function updateProductStock(id: string, quantity: number): Promise<GetProductResponse> {
  try {
    const response = await axiosInstance.patch(API.PRODUCTS.UPDATE_STOCK(id), { quantity });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update stock');
  }
}

export function getProductImageUrl(image: string): string {
  if (!image) return 'https://placehold.co/400x400/FFD700/white?text=Product';
  if (image.startsWith('http')) return image;
  if (image.startsWith('/uploads')) return image; // Proxied via next.config rewrite
  if (image.startsWith('/images')) return image;
  return `/images/${image}`;
}