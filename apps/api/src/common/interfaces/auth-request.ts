import { Request } from 'express';

export interface AuthRequest extends Request {
  user: {
    userId: string;
    email: string;
    id: string;
    name: string;
    googleId: string;
    facebookId: string;
    profileImg: string;
  };
}
