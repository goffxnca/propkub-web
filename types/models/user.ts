export interface User {
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  provider: string;
  role: string;
  tos: boolean;
  cid: number;
  phone?: string;
  line?: string;
  profileImg?: string;
  googleId?: string;
  facebookId?: string;
  lastLoginProvider?: string;
  lastLoginAt?: string;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
}
