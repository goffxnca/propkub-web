import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AdminUsersService } from '../../src/admin/users/admin-users.service';
import { User, UserRole } from '../../src/users/users.schema';
import {
  rootMongooseTestModule,
  closeMongodConnection
} from '../utils/mongodb-memory';
import { AdminUsersModule } from '../../src/admin/users/admin-users.module';
import * as bcrypt from 'bcrypt';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthProvider } from '../../src/common/enums/auth-provider.enum';
import {
  CreateUserDto,
  UpdateUserDto
} from '../../src/admin/users/dto/user.dto';
import { ConfigModule } from '@nestjs/config';

describe('AdminUsers (e2e)', () => {
  let app: INestApplication;
  let service: AdminUsersService;
  let userModel: Model<User>;

  const johnEmail = 'john.doe@example.com';
  const janeEmail = 'jane.smith@example.com';
  const jeffEmail = 'jeff@example.com';

  const testUsers: Partial<User>[] = [
    {
      name: 'John Doe',
      email: johnEmail,
      password: bcrypt.hashSync('password123', 10),
      provider: AuthProvider.EMAIL,
      role: UserRole.NORMAL
    },
    {
      name: 'Jane Smith',
      email: janeEmail,
      password: bcrypt.hashSync('password123', 10),
      provider: AuthProvider.EMAIL,
      role: UserRole.NORMAL
    },
    {
      name: 'Jeff Foo',
      email: jeffEmail,
      password: bcrypt.hashSync('password123', 10),
      provider: AuthProvider.EMAIL,
      role: UserRole.NORMAL
    }
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: '.env.test' }),
        rootMongooseTestModule(),
        AdminUsersModule
      ]
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true
      })
    );
    service = moduleFixture.get<AdminUsersService>(AdminUsersService);
    userModel = moduleFixture.get<Model<User>>(getModelToken(User.name));
    await app.init();

    for (const userData of testUsers) {
      await service.seedTest(userData);
    }
  });

  afterAll(async () => {
    await userModel.deleteMany();
    await app.close();
    await closeMongodConnection();
  });

  describe('GET /admin/users', () => {
    it('should return users with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/admin/users?limit=2&offset=0')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]._id).toBeDefined();
      expect(response.body[0].email).toBe(johnEmail);
      expect(response.body[1]._id).toBeDefined();
      expect(response.body[1].email).toBe(janeEmail);
    });

    it('should return paginated users when limit and offset provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/admin/users?limit=2&offset=2')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]._id).toBeDefined();
      expect(response.body[0].email).toBe(jeffEmail);
    });
  });

  describe('GET /admin/users/:id', () => {
    it('should return a user by id', async () => {
      const users = await request(app.getHttpServer())
        .get('/admin/users?limit=10&offset=0')
        .expect(200);

      const userId = users.body[0]._id;

      return request(app.getHttpServer())
        .get(`/admin/users/${userId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body._id).toBe(userId);
          expect(res.body.name).toBe(testUsers[0].name);
          expect(res.body.email).toBe(johnEmail);
        });
    });

    it('should return 404 when user not found', () => {
      return request(app.getHttpServer())
        .get('/admin/users/60f1a5f5f5f5f5f5f5f5f5f5')
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toContain('not found');
        });
    });
  });

  describe('POST /admin/users', () => {
    it('should create a new user', () => {
      const createUserDto: CreateUserDto = {
        name: 'New User',
        email: 'new.user@example.com',
        password: 'password123'
      };

      return request(app.getHttpServer())
        .post('/admin/users')
        .send(createUserDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.name).toBe(createUserDto.name);
          expect(res.body.email).toBe(createUserDto.email);
          expect(res.body.createdBy).toBe('admin');
        });
    });

    it('should return 409 when email already exists', () => {
      const createUserDto: CreateUserDto = {
        name: 'Duplicate User',
        email: johnEmail,
        password: 'password123'
      };

      return request(app.getHttpServer())
        .post('/admin/users')
        .send(createUserDto)
        .expect(409)
        .expect((res) => {
          expect(res.body.message).toContain('already exists');
        });
    });

    it('should return 400 if email is missing', () => {
      return request(app.getHttpServer())
        .post('/admin/users')
        .send({ name: 'Invalid User', password: 'password123' })
        .expect(400);
    });

    it('should return 400 if name is missing', () => {
      return request(app.getHttpServer())
        .post('/admin/users')
        .send({ email: 'joe@example.com', password: 'password123' })
        .expect(400);
    });

    it('should return 400 if password is missing', () => {
      return request(app.getHttpServer())
        .post('/admin/users')
        .send({ name: 'Invalid User', email: 'invalid@example.com' })
        .expect(400);
    });

    it('should return 400 if password is too short', () => {
      return request(app.getHttpServer())
        .post('/admin/users')
        .send({
          name: 'Invalid User',
          email: 'invalid@example.com',
          password: '12345'
        })
        .expect(400);
    });

    it('should return 400 if email is invalid', () => {
      return request(app.getHttpServer())
        .post('/admin/users')
        .send({
          name: 'Invalid User',
          email: 'not-an-email',
          password: 'password123'
        })
        .expect(400);
    });
  });

  describe('PUT /admin/users/:id', () => {
    it('should update a user name', async () => {
      const users = await request(app.getHttpServer())
        .get('/admin/users?limit=10&offset=0')
        .expect(200);

      const firstUser = users.body[0];
      const userId = firstUser._id;
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name'
      };

      return request(app.getHttpServer())
        .put(`/admin/users/${userId}`)
        .send(updateUserDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.name).toBe(updateUserDto.name);
          expect(res.body.updatedAt).not.toBe(firstUser.updatedAt);
          expect(res.body.email).toBe(johnEmail);
        });
    });

    it('should return 400 when name is empty', async () => {
      const users = await request(app.getHttpServer())
        .get('/admin/users?limit=10&offset=0')
        .expect(200);

      const userId = users.body[0]._id;
      const emptyUpdate = {};

      return request(app.getHttpServer())
        .put(`/admin/users/${userId}`)
        .send(emptyUpdate)
        .expect(400);
    });

    it('should return 404 when updating non-existent user', () => {
      return request(app.getHttpServer())
        .put('/admin/users/60f1a5f5f5f5f5f5f5f5f5f5')
        .send({ name: 'Updated Name' })
        .expect(404);
    });
  });

  describe('DELETE /admin/users/:id', () => {
    it('should delete a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'User To Delete',
        email: 'delete.me@example.com',
        password: 'password123'
      };

      const createResponse = await request(app.getHttpServer())
        .post('/admin/users')
        .send(createUserDto)
        .expect(201);

      const userId = createResponse.body._id;

      await request(app.getHttpServer())
        .delete(`/admin/users/${userId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body._id).toBe(userId);
        });

      return request(app.getHttpServer())
        .get(`/admin/users/${userId}`)
        .expect(404);
    });

    it('should return 404 when deleting non-existent user', () => {
      return request(app.getHttpServer())
        .delete('/admin/users/60f1a5f5f5f5f5f5f5f5f5f5')
        .expect(404);
    });
  });
});
