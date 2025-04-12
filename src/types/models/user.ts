import { Timestamp } from "firebase/firestore";

export interface User {
  id: string;
  name: string;
  phone: string;
  line: string;
  profileImg: string;
  createdAt: string;
  updatedAt?: Timestamp;
}

export interface UserProfile {
  name: string;
  phone: string;
  line: string;
  profileImg: {
    fileData?: File;
    isFileChanged: boolean;
    originFileUrl: string;
  };
} 