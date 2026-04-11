export enum AuthProvider {
  EMAIL = 'email',
  GOOGLE = 'google',
  FACEBOOK = 'facebook'
}

export enum UserRole {
  NORMAL = 'normal',
  AGENT = 'agent',
  ADMIN = 'admin'
}

export interface User {
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  provider: AuthProvider;
  role: UserRole;
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
