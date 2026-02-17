import axiosInstance from "@/lib/axios";
import { API } from "@/lib/endpoints";

export interface Category {
  _id: string;
  id: string;
  name: string;
  image: string;
  description?: string;
  productsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetCategoriesResponse {
  success: boolean;
  data: Category[];
}

export interface GetCategoryResponse {
  success: boolean;
  category: Category;
}

export interface CreateCategoryPayload {
  name: string;
  image: string;
  description?: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  image?: string;
  description?: string;
}

// Get all categories
export async function getAllCategories(): Promise<GetCategoriesResponse> {
  try {
    const response = await axiosInstance.get(API.CATEGORIES.GET_ALL);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch categories');
  }
}

// Get single category
export async function getCategoryById(id: string): Promise<GetCategoryResponse> {
  try {
    const response = await axiosInstance.get(API.CATEGORIES.GET_BY_ID(id));
    return response.data;
  } catch (error: any) {
    console.error('Error fetching category:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch category');
  }
}

// Create category
export async function createCategory(data: CreateCategoryPayload): Promise<GetCategoryResponse> {
  try {
    const response = await axiosInstance.post(API.CATEGORIES.CREATE, data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating category:', error);
    throw new Error(error.response?.data?.message || 'Failed to create category');
  }
}

// Update category
export async function updateCategory(id: string, data: UpdateCategoryPayload): Promise<GetCategoryResponse> {
  try {
    const response = await axiosInstance.put(API.CATEGORIES.UPDATE(id), data);
    return response.data;
  } catch (error: any) {
    console.error('Error updating category:', error);
    throw new Error(error.response?.data?.message || 'Failed to update category');
  }
}

// Delete category
export async function deleteCategory(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axiosInstance.delete(API.CATEGORIES.DELETE(id));
    return response.data;
  } catch (error: any) {
    console.error('Error deleting category:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete category');
  }
}