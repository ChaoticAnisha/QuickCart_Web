import { API_BASE_URL } from './constants';
import Cookies from 'js-cookie';

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

export const getAnalytics = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};