import { apiRequest } from "../lib/api-client";
import type { Notification } from "../types/notification";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function getNotifications(): Promise<Notification[]> {
  const res = await apiRequest<ApiResponse<Notification[]>>("/api/notifications");
  return res.data;
}

export async function getUnreadCount(): Promise<number> {
  const res = await apiRequest<ApiResponse<{ count: number }>>("/api/notifications/unread/count");
  return res.data.count;
}

export async function markAsRead(notificationId: string): Promise<Notification> {
  const res = await apiRequest<ApiResponse<Notification>>(
    `/api/notifications/${notificationId}/read`,
    { method: "PATCH" }
  );
  return res.data;
}
