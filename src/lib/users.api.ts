import axiosInstance from "@/lib/axios";
import { API } from "@/lib/endpoints";

export interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetUsersResponse {
  success: boolean;
  data: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetUserResponse {
  success: boolean;
  user: User;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  role?: string;
  password?: string;
}

export interface UpdateUserResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}

// Get all users with pagination and search
export async function getAllUsers(
  page: number = 1,
  limit: number = 10,
  search: string = ''
): Promise<GetUsersResponse> {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (search) params.append('search', search);

    const response = await axiosInstance.get(`${API.USERS.GET_ALL}?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching users:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch users');
  }
}

// Get single user by ID
export async function getUserById(id: string): Promise<GetUserResponse> {
  try {
    const response = await axiosInstance.get(API.USERS.GET_BY_ID(id));
    return response.data;
  } catch (error: any) {
    console.error('Error fetching user:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch user');
  }
}

// Update user
export async function updateUser(
  id: string,
  data: UpdateUserPayload
): Promise<UpdateUserResponse> {
  try {
    const response = await axiosInstance.put(API.USERS.UPDATE(id), data);
    return response.data;
  } catch (error: any) {
    console.error('Error updating user:', error);
    throw new Error(error.response?.data?.message || 'Failed to update user');
  }
}

// Delete user
export async function deleteUser(id: string): Promise<DeleteUserResponse> {
  try {
    const response = await axiosInstance.delete(API.USERS.DELETE(id));
    return response.data;
  } catch (error: any) {
    console.error('Error deleting user:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete user');
  }
}