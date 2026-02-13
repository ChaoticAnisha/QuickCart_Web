import axiosInstance from "@/lib/axios";
import { API } from "@/lib/endpoints";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  address?: string;
  phone?: string;
  role?: string; // optional, but we'll default to "user"
}

export interface RegisterResponse {
  success: boolean;
  error?: string;
}

export async function registerUser(data: RegisterPayload): Promise<RegisterResponse> {
 console.log(data);
    try {
    // Always send role as "user" unless caller overrides
    const payload: RegisterPayload = { ...data, role: data.role ?? "USER" };

    await axiosInstance.post(API.AUTH.REGISTER, payload);
    return { success: true };
  } catch (error: unknown) {
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
