import { Timestamp } from "firebase/firestore";

export interface Migration {
  id: string;
  funcName: string;
  mKey: string;
  createdAt: Timestamp;
  ranAt?: Timestamp;
  result?: any;
}

export interface MigrationResult {
  success: boolean;
  message?: string;
  data?: any;
} 