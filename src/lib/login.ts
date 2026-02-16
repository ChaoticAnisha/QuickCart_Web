import axiosInstance from "@/lib/axios";
import { API } from "@/lib/endpoints";
import { setAuthToken } from "@/lib/cookies";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  role?: string;
  error?: string;
  user?: any;  
}

export async function loginUser(data: LoginPayload): Promise<LoginResponse> {
  try {
    const response = await axiosInstance.post(API.AUTH.LOGIN, data);
    
    console.log('Login response:', response.data);
    
    if (response.data.success && response.data.data) {
      const userData = response.data.data;
      
      // ✅ Store complete user data in cookie
      const authData = {
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone || '',
          address: userData.address || '',
          role: userData.role === 'admin' ? 'admin' : 'client',
        },
        token: response.data.token || 'mock-token-' + Date.now(),
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      };

      document.cookie = `quickcart_auth=${encodeURIComponent(JSON.stringify(authData))}; path=/; max-age=${7 * 24 * 60 * 60}`;
      
      // If your API returns a token, store it
      if (response.data.token) {
        setAuthToken(response.data.token);
      }
      
      return {
        success: true,
        role: userData.role,
        user: authData.user
      };
    }
    
    return { success: false, error: "Login failed. Please try again." };
  } catch (error: unknown) {
    console.error('Login error:', error);
    
    let message = "Login failed. Please try again.";
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === "object" && error !== null) {
      const errObj = error as { response?: { data?: { message?: string } } };
      if (errObj.response?.data?.message) {
        message = errObj.response.data.message;
      }
    }
    return { success: false, error: message };
  }
}