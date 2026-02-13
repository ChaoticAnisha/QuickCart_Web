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
}

export async function loginUser(data: LoginPayload): Promise<LoginResponse> {
  try {
    const response = await axiosInstance.post(API.AUTH.LOGIN, data);
    // Assuming backend returns { success: true, role: "admin" | "user" }
    return {
      success: true,
      role: response.data.role,
    };
  } catch (error: unknown) {
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
