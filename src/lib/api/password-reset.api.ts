import { API_BASE_URL } from '../constants';

export const requestPasswordReset = async (email: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Request password reset failed');
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    });
    
    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Reset password failed');
  }
};