import axiosInstance from "@/lib/axios";
import { API } from "@/lib/endpoints";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  address?: string;
  phone?: string;
  role?: string;
}

export interface RegisterResponse {
  success: boolean;
  error?: string;
  user?: any;  
}

export async function registerUser(data: RegisterPayload): Promise<RegisterResponse> {
  console.log('Registering user with data:', data);
  
  try {
    // Send role as "user" for normal registration
    const payload: RegisterPayload = { ...data, role: data.role ?? "user" };
    
    const response = await axiosInstance.post(API.AUTH.REGISTER, payload);
    
    console.log('Registration response:', response.data);
    
    if (response.data.success && response.data.user) {
      // Store complete user data in cookie
      const authData = {
        user: {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          phone: response.data.user.phone || '',
          address: response.data.user.address || '',
          role: response.data.user.role === 'admin' ? 'admin' : 'client',
        },
        token: 'mock-token-' + Date.now(),
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, 
      };

      document.cookie = `quickcart_auth=${encodeURIComponent(JSON.stringify(authData))}; path=/; max-age=${7 * 24 * 60 * 60}`;
      
      return { 
        success: true,
        user: authData.user
      };
    }
    
    return { success: false, error: "Registration failed" };
  } catch (error: unknown) {
    console.error('Registration error:', error);
    
    let message = "Registration failed. Please try again.";
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