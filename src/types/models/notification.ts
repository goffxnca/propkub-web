import { Timestamp } from "firebase/firestore";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: Timestamp;
  data?: any;
}

export interface GetNotificationsParams {
  userId: string;
}

export interface GetNotificationsResponse {
  success: boolean;
  notifications: Notification[];
  message?: string;
}

export interface ReadNotificationParams {
  notificationId: string;
}

export interface ReadNotificationResponse {
  success: boolean;
  message?: string;
}
