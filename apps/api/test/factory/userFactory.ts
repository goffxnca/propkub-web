import { AuthProvider } from '../../src/common/enums/auth-provider.enum';
import { User, UserRole } from '../../src/users/users.schema';

// Base user template
export const baseUser: User = {
  _id: '1',
  cid: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  emailVerified: false,
  provider: AuthProvider.EMAIL,
  role: UserRole.NORMAL,
  tos: true,
  password: '123456',
  createdAt: new Date(),
  ___f_auth_mail_sent: false, //TODO: Remove later
  ___f_pre_auth_mail_sent: false //TODO: Remove later
};

export const createUser = (overrides: Partial<User> = {}): User => {
  return {
    ...baseUser,
    ...overrides
  };
};
