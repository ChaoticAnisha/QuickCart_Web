import { API_BASE_URL } from './constants';
import Cookies from 'js-cookie';

// Helper to get auth headers from cookie
const getAuthHeaders = () => {
  const authCookie = Cookies.get('quickcart_auth');
  if (!authCookie) return {};
  
  try {
    const { user } = JSON.parse(authCookie);
    return {
      'x-user-id': user.id,
      'x-user-role': user.role,
      'x-user-email': user.email,
    };
  } catch {
    return {};
  }
};

// Get all users with pagination
export const getAllUsers = async (page = 1, limit = 10, search = '') => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/users?page=${page}&limit=${limit}&search=${search}`,
      {
        headers: getAuthHeaders(),
        credentials: 'include',
      }
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Get single user
export const getUserById = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// Create user
export const createUser = async (formData: FormData) => {
  try {
    const authHeaders = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: authHeaders,
      body: formData, // FormData automatically sets content-type
      credentials: 'include',
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Update user
export const updateUser = async (id: string, formData: FormData) => {
  try {
    const authHeaders = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'PUT',
      headers: authHeaders,
      body: formData,
      credentials: 'include',
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Delete user
export const deleteUser = async (id: string) => {
  try {
    const authHeaders = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: authHeaders,
      credentials: 'include',
    });
    return await response.json();
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};