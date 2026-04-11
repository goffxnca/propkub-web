import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { User, UserRole } from '../../src/users/users.schema';
import { SignupDto } from '../../src/auth/dto/signupDto';
import {
  rootMongooseTestModule,
  closeMongodConnection
} from '../utils/mongodb-memory';
import { AuthModule } from '../../src/auth/auth.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from '../../src/users/users.service';
import { ConfigModule } from '@nestjs/config';
import { MailService } from '../../src/mail/mail.service';
import { v4 as uuidV4 } from 'uuid';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let userModel: Model<User>;
  let usersService: UsersService;
  let mailService: MailService;

  const testUser = {
    name: 'John Doe',
    email: 'john@test.com',
    password: 'password123',
    role: UserRole.NORMAL
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.test' }),
        rootMongooseTestModule(),
        AuthModule
      ]
    })
      .overrideProvider(MailService)
      .useValue({
        sendEmail: jest.fn().mockResolvedValue(undefined)
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true
      })
    );
    userModel = moduleFixture.get<Model<User>>(getModelToken(User.name));
    usersService = moduleFixture.get<UsersService>(UsersService);
    mailService = moduleFixture.get<MailService>(MailService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await closeMongodConnection();
  });

  describe('POST /auth/register', () => {
    it('should create a new normal user and return JWT token', async () => {
      const sendEmailSpy = jest.spyOn(mailService, 'sendEmail');
      const signupDto: SignupDto = {
        name: testUser.name,
        email: testUser.email,
        password: testUser.password,
        isAgent: false
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(signupDto)
        .expect(201)
        .expect((res) => {
          expect(res.body.accessToken).toBeDefined();
          expect(res.body.accessToken).toContain('eyJhb');
        });

      expect(sendEmailSpy).toHaveBeenCalled();

      const user = await userModel.findOne({ email: testUser.email });
      expect(user).toBeDefined();
      expect(user?.role).toBe(UserRole.NORMAL);
      expect(user?.temp_p).toBeUndefined();
    });

    it('should create a new agent user and return JWT token', async () => {
      const sendEmailSpy = jest.spyOn(mailService, 'sendEmail');

      const agentEmail = 'agent@mail.com';
      const signupDto: SignupDto = {
        name: testUser.name,
        email: agentEmail,
        password: testUser.password,
        isAgent: true
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(signupDto)
        .expect(201)
        .expect((res) => {
          expect(res.body.accessToken).toBeDefined();
          expect(res.body.accessToken).toContain('eyJhb');
        });

      expect(sendEmailSpy).toHaveBeenCalled();

      const user = await userModel.findOne({ email: agentEmail });
      expect(user).toBeDefined();
      expect(user?.role).toBe(UserRole.AGENT);
    });

    it('should return 409 when email already exists', () => {
      const data: SignupDto = {
        name: 'Duplicate User',
        email: testUser.email,
        password: testUser.password,
        isAgent: false
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(data)
        .expect(409);
    });

    it('should return 400 when name is missing', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'new.user2@test.com', password: testUser.password })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('name should not be empty');
        });
    });

    it('should return 400 when email is missing', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ name: 'New User', password: testUser.password })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('email should not be empty');
        });
    });

    it('should return 400 when password is missing', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ name: 'New User', email: 'new.user3@test.com' })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('password should not be empty');
        });
    });

    it('should return 400 when email is invalid format', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'New User',
          email: 'not-an-email',
          password: testUser.password
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('email must be an email');
        });
    });

    it('should return 400 when password is too short', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'New User',
          email: 'new.user4@test.com',
          password: '12345'
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain(
            'password must be longer than or equal to 6 characters'
          );
        });
    });

    // Security Test: Prevent injecting non-whitelisted field
    it('should return 400 when dangerous role field is sent', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Hacker User',
          email: 'hacker@test.com',
          password: 'password123',
          isAgent: false,
          role: 'admin' // Non-whitelisted
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('property role should not exist');
        });
    });
  });

  describe('POST /auth/login', () => {
    it('should return JWT token when credentials are valid', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testUser.email, password: testUser.password })
        .expect(200);

      expect(response.body.accessToken).toBeDefined();
      expect(response.body.accessToken).toContain('eyJhb');
    });

    it('should return 401 when credentials are invalid', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testUser.email, password: 'wrongpassword' })
        .expect(401);
    });

    it('should return 400 when email is missing', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ password: testUser.password })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('email should not be empty');
        });
    });

    it('should return 400 when password is missing', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testUser.email })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('password should not be empty');
        });
    });

    it('should return 400 when email is invalid format', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'not-an-email', password: testUser.password })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('email must be an email');
        });
    });
  });

  describe('GET /auth/profile', () => {
    it('should return the user profile when authenticated', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testUser.email, password: testUser.password })
        .expect(200);

      const accessToken = response.body.accessToken;
      expect(accessToken).toBeDefined();

      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe(testUser.name);
          expect(res.body.email).toBe(testUser.email);
          expect(res.body.temp_p).toBeUndefined();
        });
    });

    it('should return 401 when no token is provided', () => {
      return request(app.getHttpServer()).get('/auth/profile').expect(401);
    });

    it('should return 401 when invalid token is provided', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('POST /auth/forgot-password', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should create a password reset token for existing user', async () => {
      const createTokenSpy = jest.spyOn(
        usersService,
        'createPasswordResetToken'
      );
      const sendEmailSpy = jest.spyOn(mailService, 'sendEmail');

      const response = await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email: testUser.email })
        .expect(200);

      expect(response.body.message).toBe(
        'If the email exists, a password reset link has been sent'
      );
      expect(createTokenSpy).toHaveBeenCalledWith(testUser.email);
      expect(sendEmailSpy).toHaveBeenCalled();

      const user = await userModel.findOne({ email: testUser.email });
      expect(user).not.toBeNull();
      expect(user?.passwordReset?.token).toBeDefined();
      expect(user?.passwordReset?.expires).toBeDefined();
    });

    it('should return same response for non-existent email', async () => {
      const createTokenSpy = jest.spyOn(
        usersService,
        'createPasswordResetToken'
      );
      const sendEmailSpy = jest.spyOn(mailService, 'sendEmail');

      const response = await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email: 'nonexist@user.com' })
        .expect(200);

      expect(response.body.message).toBe(
        'If the email exists, a password reset link has been sent'
      );
      expect(createTokenSpy).not.toHaveBeenCalled();
      expect(sendEmailSpy).not.toHaveBeenCalled();
    });

    it('should return 400 when email is missing', () => {
      return request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({})
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('email should not be empty');
        });
    });

    it('should return 400 when email format is invalid', () => {
      return request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email: 'not-an-email' })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('email must be an email');
        });
    });
  });

  describe('GET /auth/validate-reset-token', () => {
    let validResetToken: string;

    beforeAll(async () => {
      const token = await usersService.createPasswordResetToken(testUser.email);
      validResetToken = token!;
    });

    it('should validate a valid reset token', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/validate-reset-token')
        .query({ token: validResetToken })
        .expect(200);

      expect(response.body.message).toBe('Reset token is valid');
    });

    it('should return 400 for invalid token', async () => {
      const invalidToken = uuidV4();

      const response = await request(app.getHttpServer())
        .get('/auth/validate-reset-token')
        .query({ token: invalidToken })
        .expect(400);

      expect(response.body.message).toBe('Invalid or expired reset token');
    });
  });

  describe('POST /auth/reset-password', () => {
    let resetToken: string;
    const newPassword = 'newPassword123';

    beforeAll(async () => {
      const token = await usersService.createPasswordResetToken(testUser.email);
      resetToken = token!;
    });

    it('should reset password with valid token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/reset-password')
        .send({
          token: resetToken,
          newPassword: newPassword
        })
        .expect(200);

      expect(response.body.message).toBe(
        'Password has been reset successfully'
      );

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: newPassword
        })
        .expect(200);

      expect(loginResponse.body.accessToken).toBeDefined();
      expect(loginResponse.body.accessToken).toContain('eyJhb');

      const updatedUser = await userModel
        .findOne({ email: testUser.email })
        .select('+temp_p');
      expect(updatedUser).not.toBeNull();
      expect(updatedUser?.passwordReset?.token).toBeUndefined();
      expect(updatedUser?.passwordReset?.expires).toBeUndefined();
      expect(updatedUser?.temp_p).toBeUndefined();
    });

    it('should return 400 with invalid token', async () => {
      const invalidToken = uuidV4();

      const response = await request(app.getHttpServer())
        .post('/auth/reset-password')
        .send({
          token: invalidToken,
          newPassword: newPassword
        })
        .expect(400);

      expect(response.body.message).toBe('Invalid or expired reset token');
    });

    it('should return 400 when token is missing', () => {
      return request(app.getHttpServer())
        .post('/auth/reset-password')
        .send({
          newPassword: newPassword
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('token should not be empty');
        });
    });

    it('should return 400 when new password is missing', () => {
      return request(app.getHttpServer())
        .post('/auth/reset-password')
        .send({
          token: resetToken
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('newPassword should not be empty');
        });
    });

    it('should return 400 when new password is too short', () => {
      return request(app.getHttpServer())
        .post('/auth/reset-password')
        .send({
          token: resetToken,
          newPassword: '12345'
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain(
            'newPassword must be longer than or equal to 6 characters'
          );
        });
    });

    afterAll(async () => {
      const user = await userModel.findOne({ email: testUser.email });
      if (user) {
        user.password = testUser.password;
        await user.save();
      }
    });
  });

  describe('PATCH /auth/profile', () => {
    let accessToken: string;

    beforeAll(async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      accessToken = loginResponse.body.accessToken;
    });

    it('should update name successfully', async () => {
      const updatedName = 'John Updated';

      const response = await request(app.getHttpServer())
        .patch('/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: updatedName })
        .expect(200);

      expect(response.body.name).toBe(updatedName);
      expect(response.body.email).toBe(testUser.email);
      expect(response.body.updatedAt).toBeDefined();

      // Verify in database
      const user = await userModel.findOne({ email: testUser.email });
      expect(user?.name).toBe(updatedName);
    });

    it('should update all DTO fields successfully', async () => {
      const updateData = {
        name: 'John Complete',
        phone: '0812345678',
        line: '@john_property',
        profileImg:
          'https://firebasestorage.googleapis.com/v0/b/test/o/us%2Fuser123%2Fi%2Fprofile.jpg'
      };

      const response = await request(app.getHttpServer())
        .patch('/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe(updateData.name);
      expect(response.body.phone).toBe(updateData.phone);
      expect(response.body.line).toBe(updateData.line);
      expect(response.body.profileImg).toBe(updateData.profileImg);
      expect(response.body.updatedAt).toBeDefined();

      // Verify in database
      const user = await userModel.findOne({ email: testUser.email });
      expect(user?.name).toBe(updateData.name);
      expect(user?.phone).toBe(updateData.phone);
      expect(user?.line).toBe(updateData.line);
      expect(user?.profileImg).toBe(updateData.profileImg);
    });

    it('should return 400 when dangerous field role:admin is sent', () => {
      return request(app.getHttpServer())
        .patch('/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Hacker Name',
          role: 'admin' // Dangerous non-whitelisted field
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('property role should not exist');
        });
    });

    it('should return 401 when bad token is provided', () => {
      return request(app.getHttpServer())
        .patch('/auth/profile')
        .set('Authorization', 'Bearer bad-invalid-token')
        .send({ name: 'Should Fail' })
        .expect(401);
    });
  });

  describe('POST /auth/update-password', () => {
    let accessToken: string;
    const newPassword = 'newPassword123';

    beforeAll(async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      accessToken = loginResponse.body.accessToken;
    });

    it('should update password when current password is correct', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/update-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: testUser.password,
          newPassword: newPassword
        })
        .expect(200);

      expect(response.body.message).toBe(
        'Password has been updated successfully'
      );

      // Verify password was changed by trying to login with new password
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: newPassword
        })
        .expect(200);

      expect(loginResponse.body.accessToken).toBeDefined();
      expect(loginResponse.body.accessToken).toContain('eyJhb');

      // Reset password back to original for subsequent tests
      await request(app.getHttpServer())
        .post('/auth/update-password')
        .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
        .send({
          currentPassword: newPassword,
          newPassword: testUser.password
        })
        .expect(200);

      const updatedUser = await userModel
        .findOne({ email: testUser.email })
        .select('+temp_p');
      expect(updatedUser?.temp_p).toBeUndefined();
    });

    it('should return 401 when current password is incorrect', () => {
      return request(app.getHttpServer())
        .post('/auth/update-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'wrongPassword',
          newPassword: newPassword
        })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toBe('Current password is incorrect');
        });
    });

    it('should return 401 when not authenticated', () => {
      return request(app.getHttpServer())
        .post('/auth/update-password')
        .send({
          currentPassword: testUser.password,
          newPassword: newPassword
        })
        .expect(401);
    });

    it('should return 400 when currentPassword is missing', () => {
      return request(app.getHttpServer())
        .post('/auth/update-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          newPassword: newPassword
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain(
            'currentPassword should not be empty'
          );
        });
    });

    it('should return 400 when newPassword is missing', () => {
      return request(app.getHttpServer())
        .post('/auth/update-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: testUser.password
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('newPassword should not be empty');
        });
    });

    it('should return 400 when newPassword is too short', () => {
      return request(app.getHttpServer())
        .post('/auth/update-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: testUser.password,
          newPassword: '12345'
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain(
            'newPassword must be longer than or equal to 6 characters'
          );
        });
    });

    afterAll(async () => {
      const user = await userModel.findOne({ email: testUser.email });
      if (user) {
        user.password = testUser.password;
        await user.save();
      }
    });
  });

  describe('GET /auth/verify-email', () => {
    let verificationToken: string;

    const toBeVerifiedUser: SignupDto = {
      name: 'Verify Test User',
      email: 'verify@test.com',
      password: 'password123',
      isAgent: false
    };

    beforeAll(async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(toBeVerifiedUser)
        .expect(201);

      const newUser = await userModel.findOne({
        email: toBeVerifiedUser.email
      });
      expect(newUser).not.toBeNull();
      expect(newUser?.emailVerified).toBe(false);
      verificationToken = newUser?.emailVToken || '';
    });

    it('should verify email with valid token', async () => {
      await request(app.getHttpServer())
        .get(`/auth/verify-email?vtoken=${verificationToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBe('Email verified successfully');
        });

      const updatedUser = await userModel.findOne({
        email: toBeVerifiedUser.email
      });
      expect(updatedUser).not.toBeNull();
      expect(updatedUser?.emailVerified).toBe(true);
      expect(updatedUser?.emailVToken).toBeUndefined();
    });

    it('should return 400 with invalid token', () => {
      const invalidToken = uuidV4();

      return request(app.getHttpServer())
        .get(`/auth/verify-email?vtoken=${invalidToken}`)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toBe(
            'Invalid or expired verification token.'
          );
        });
    });

    it('should return 400 when token is missing', () => {
      return request(app.getHttpServer())
        .get('/auth/verify-email')
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('vtoken should not be empty');
        });
    });

    it('should return 400 when trying to verify already verified email', () => {
      return request(app.getHttpServer())
        .get(`/auth/verify-email?vtoken=${verificationToken}`)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toBe(
            'Invalid or expired verification token.'
          );
        });
    });

    afterAll(async () => {
      await userModel.deleteMany();
    });
  });
});
