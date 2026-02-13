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

    // Example response shape:
    // {
    //   success: true,
    //   data: { id, email, name, role },
    //   token: "..."   <-- if your API sends a token
    // }

    if (response.data.success) {
      const { role } = response.data.data;

      // If your API returns a token, store it
      if (response.data.token) {
        setAuthToken(response.data.token);
      }

      return {
        success: true,
        role,
      };
    }

    return { success: false, error: "Login failed. Please try again." };
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
