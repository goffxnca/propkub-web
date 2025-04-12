import { Timestamp } from "firebase/firestore";

export interface PostAction {
  id: string;
  postId: string;
  type: string;
  createdAt: Timestamp;
  data?: any;
}

export interface GetPostActionsParams {
  postId: string;
}

export interface GetPostActionsResponse {
  success: boolean;
  actions: PostAction[];
  message?: string;
}

export interface AdminMarkPostAsFulfilledParams {
  postId: string;
  actionByAdmin: boolean;
}

export interface AdminMarkPostAsFulfilledResponse {
  success: boolean;
  message?: string;
} 