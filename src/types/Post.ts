import { Timestamp } from "firebase/firestore";

export interface PostView {
  id: string;
  postId: string;
  views: number;
  phoneViews: number;
  lineViews: number;
  lastUpdated: Timestamp;
}

export interface GetPostViewResponse {
  success: boolean;
  view: PostView;
  message?: string;
}

export interface IncreaseViewResponse {
  success: boolean;
  message?: string;
}
