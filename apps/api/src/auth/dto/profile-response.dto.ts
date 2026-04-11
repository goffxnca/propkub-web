import { User } from '../../users/users.schema';

export type ProfileResponseDto = Omit<
  User,
  'password' | 'emailVToken' | 'passwordReset'
>;
