import { API_BASE_URL } from "./constants";

export async function getUserProfile(userId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to fetch profile",
      };
    }

    return {
      success: true,
      user: data.user,
    };
  } catch (error) {
    console.error("Profile fetch error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}