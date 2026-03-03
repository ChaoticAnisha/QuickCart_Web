import axiosInstance from "@/lib/axios";

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  userId: any;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "processing" | "out_for_delivery" | "delivered" | "cancelled";
  deliveryAddress: string;
  paymentMethod: string;
  paymentStatus: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryAddress: string;
  paymentMethod: string;
  note?: string;
}

export async function createOrder(data: CreateOrderPayload): Promise<{ success: boolean; order: Order; message: string }> {
  try {
    const response = await axiosInstance.post("/api/orders", data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create order");
  }
}

export async function getAllOrders(page = 1, limit = 10, status?: string) {
  try {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (status && status !== "all") params.append("status", status);

    const response = await axiosInstance.get(`/api/orders?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch orders");
  }
}

export async function getUserOrders(userId: string, page = 1, limit = 10) {
  try {
    const response = await axiosInstance.get(`/api/orders/user/${userId}?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch orders");
  }
}

export async function getOrderById(orderId: string) {
  try {
    const response = await axiosInstance.get(`/api/orders/${orderId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch order");
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const response = await axiosInstance.patch(`/api/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update order status");
  }
}

export function getStatusColor(status: string) {
  switch (status) {
    case "pending": return "bg-yellow-100 text-yellow-700";
    case "confirmed": return "bg-blue-100 text-blue-700";
    case "processing": return "bg-purple-100 text-purple-700";
    case "out_for_delivery": return "bg-orange-100 text-orange-700";
    case "delivered": return "bg-green-100 text-green-700";
    case "cancelled": return "bg-red-100 text-red-700";
    default: return "bg-gray-100 text-gray-700";
  }
}

export function getStatusLabel(status: string) {
  switch (status) {
    case "pending": return "Pending";
    case "confirmed": return "Confirmed";
    case "processing": return "Processing";
    case "out_for_delivery": return "Out for Delivery";
    case "delivered": return "Delivered";
    case "cancelled": return "Cancelled";
    default: return status;
  }
}