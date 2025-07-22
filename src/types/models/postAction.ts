import { Timestamp } from "firebase/firestore";

export interface PostAction {
  id: string;
  postId: string;
  type: string;
  createdAt: Timestamp;
  data?: any;
}
