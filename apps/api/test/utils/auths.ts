import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { User } from '../../src/users/users.schema';
import { UsersService } from '../../src/users/users.service';
import { AuthProvider } from '../../src/common/enums/auth-provider.enum';

export const createUserAndLogIn = async (
  user: User,
  app: INestApplication,
  userService: UsersService
): Promise<[User, string]> => {
  const createUser = await userService.create(
    user.name,
    user.email,
    user.password!,
    user.role,
    AuthProvider.EMAIL
  );

  const response = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email: user.email, password: user.password });

  if (response.status !== 200) {
    throw new Error(`Login failed: ${response.body.message}`);
  }

  const token = response.body.accessToken;
  return [createUser, token];
};

export const authHeader = (token: string) => ({
  Authorization: `Bearer ${token}`
});
