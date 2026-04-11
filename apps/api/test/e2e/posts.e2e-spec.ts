import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { PostsService } from '../../src/posts/posts.service';
import {
  Post,
  PostType,
  AssetType,
  PostStatus
} from '../../src/posts/posts.schema';
import { createPost } from '../factory/postFactory';
import {
  rootMongooseTestModule,
  closeMongodConnection
} from '../utils/mongodb-memory';
import { PostsModule } from '../../src/posts/posts.module';
import { ConfigModule } from '@nestjs/config';
import { Model, Types } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { CreatePostDto } from '../../src/posts/dto/createPostDto';
import { AuthModule } from '../../src/auth/auth.module';
import { UsersService } from '../../src/users/users.service';
import { authHeader, createUserAndLogIn } from '../utils/auths';
import { User } from '../../src/users/users.schema';
import { createUser } from '../factory/userFactory';
import { MailService } from '../../src/mail/mail.service';
import {
  PostActions,
  PostActionType
} from '../../src/postActions/postActions.schema';
import { POST_ACTIONS_FLOW } from '../../src/common/postActionsFlow';
import { PostStatType } from '../../src/posts/dto/increase-post-stats.dto';

describe('Posts (e2e)', () => {
  let app: INestApplication;
  let service: PostsService;
  let usersService: UsersService;
  let mailService: MailService;
  let postModel: Model<Post>;
  let userModel: Model<User>;
  let postActionsModel: Model<PostActions>;
  let testUser: User;
  let authToken: string;

  const API_KEY_FOR_NEXTJS_SERVER = '1234';

  const mockPosts: Post[] = [
    createPost({
      _id: new Types.ObjectId().toString(),
      title: 'Luxury Condo in Bangkok',
      assetType: AssetType.CONDO,
      postType: PostType.RENT,
      address: {
        provinceId: '1',
        provinceLabel: 'Bangkok',
        districtId: '1',
        districtLabel: 'Phra Nakhon',
        subDistrictId: '1',
        subDistrictLabel: 'Phra Borom Maha Ratchawang',
        regionId: '1',
        location: { lat: 13.7563, lng: 100.5018 }
      }
    }),
    createPost({
      _id: new Types.ObjectId().toString(),
      title: 'Modern House for Rent',
      assetType: AssetType.HOUSE,
      postType: PostType.RENT,
      address: {
        provinceId: '1',
        provinceLabel: 'Bangkok',
        districtId: '1',
        districtLabel: 'Phra Nakhon',
        subDistrictId: '1',
        subDistrictLabel: 'Phra Borom Maha Ratchawang',
        regionId: '1',
        location: { lat: 13.7563, lng: 100.5018 }
      }
    }),
    createPost({
      _id: new Types.ObjectId().toString(),
      title: 'Luxury Villa in Bangkok',
      assetType: AssetType.HOUSE,
      postType: PostType.SALE,
      address: {
        provinceId: '1',
        provinceLabel: 'Bangkok',
        districtId: '1',
        districtLabel: 'Phra Nakhon',
        subDistrictId: '1',
        subDistrictLabel: 'Phra Borom Maha Ratchawang',
        regionId: '1',
        location: { lat: 13.7563, lng: 100.5018 }
      }
    }),
    createPost({
      _id: new Types.ObjectId().toString(),
      title: 'Studio Apartment for Rent',
      assetType: AssetType.CONDO,
      postType: PostType.RENT,
      address: {
        provinceId: '1',
        provinceLabel: 'Bangkok',
        districtId: '2',
        districtLabel: 'Dusit',
        subDistrictId: '2',
        subDistrictLabel: 'Dusit',
        regionId: '1',
        location: { lat: 13.7763, lng: 100.5168 }
      }
    }),
    createPost({
      _id: new Types.ObjectId().toString(),
      title: 'Townhome in CBD',
      assetType: AssetType.TOWNHOME,
      postType: PostType.SALE,
      address: {
        provinceId: '1',
        provinceLabel: 'Bangkok',
        districtId: '2',
        districtLabel: 'Dusit',
        subDistrictId: '2',
        subDistrictLabel: 'Dusit',
        regionId: '1',
        location: { lat: 13.7763, lng: 100.5168 }
      }
    }),
    createPost({
      _id: new Types.ObjectId().toString(),
      title: 'Townhome for Sale',
      assetType: AssetType.TOWNHOME,
      postType: PostType.RENT,
      address: {
        provinceId: '2',
        provinceLabel: 'Nonthaburi',
        districtId: '3',
        districtLabel: 'Mueang Nonthaburi',
        subDistrictId: '3',
        subDistrictLabel: 'Suan Yai',
        regionId: '1',
        location: { lat: 13.8625, lng: 100.5144 }
      }
    }),
    createPost({
      _id: new Types.ObjectId().toString(),
      title: 'Land Plot in Suburb',
      assetType: AssetType.LAND,
      postType: PostType.SALE,
      address: {
        provinceId: '2',
        provinceLabel: 'Nonthaburi',
        districtId: '3',
        districtLabel: 'Mueang Nonthaburi',
        subDistrictId: '3',
        subDistrictLabel: 'Suan Yai',
        regionId: '1',
        location: { lat: 13.8625, lng: 100.5144 }
      }
    }),
    createPost({
      _id: new Types.ObjectId().toString(),
      title: 'Penthouse with City View',
      assetType: AssetType.CONDO,
      postType: PostType.SALE,
      address: {
        provinceId: '2',
        provinceLabel: 'Nonthaburi',
        districtId: '4',
        districtLabel: 'Bang Kruai',
        subDistrictId: '4',
        subDistrictLabel: 'Bang Kruai',
        regionId: '1',
        location: { lat: 13.805, lng: 100.4722 }
      }
    }),
    createPost({
      _id: new Types.ObjectId().toString(),
      title: 'Family House with Garden',
      assetType: AssetType.HOUSE,
      postType: PostType.RENT,
      address: {
        provinceId: '2',
        provinceLabel: 'Nonthaburi',
        districtId: '4',
        districtLabel: 'Bang Kruai',
        subDistrictId: '4',
        subDistrictLabel: 'Bang Kruai',
        regionId: '1',
        location: { lat: 13.805, lng: 100.4722 }
      }
    }),
    createPost({
      _id: new Types.ObjectId().toString(),
      title: 'Luxury Condo for Rent',
      assetType: AssetType.CONDO,
      postType: PostType.RENT,
      address: {
        provinceId: 'p11',
        provinceLabel: 'Chonburi',
        districtId: 'd2007',
        districtLabel: 'Sriracha',
        subDistrictId: 's200702',
        subDistrictLabel: 'Surasak',
        regionId: 'r5',
        location: { lat: 13.805, lng: 100.4722 }
      }
    })
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.test' }),
        rootMongooseTestModule(),
        PostsModule,
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

    service = moduleFixture.get<PostsService>(PostsService);
    usersService = moduleFixture.get<UsersService>(UsersService);
    mailService = moduleFixture.get<MailService>(MailService);

    postModel = moduleFixture.get<Model<Post>>(getModelToken(Post.name));
    userModel = moduleFixture.get<Model<User>>(getModelToken(User.name));
    postActionsModel = moduleFixture.get<Model<PostActions>>(
      getModelToken(PostActions.name)
    );

    await app.init();

    const [user, token] = await createUserAndLogIn(
      createUser(),
      app,
      usersService
    );

    authToken = token;
    testUser = user;

    for (const post of mockPosts) {
      post.createdAt = new Date();
      post.createdBy = user._id;
      await service.seedTest(post);
    }
  });

  afterAll(async () => {
    await postActionsModel.deleteMany();
    await postModel.deleteMany();
    await userModel.deleteMany();
    await app.close();
    await closeMongodConnection();
  });

  describe('GET /posts/me', () => {
    it('should return user own posts when authenticated', () => {
      return request(app.getHttpServer())
        .get('/posts/me?page=1&per_page=2')
        .set(authHeader(authToken))
        .expect(200)
        .expect((res) => {
          expect(res.body.items).toBeDefined();
          expect(Array.isArray(res.body.items)).toBe(true);
          expect(res.body.total_count).toBeDefined();
          expect(res.body.page).toBe(1);
          expect(res.body.per_page).toBe(2);

          // Verify all returned posts are created by the authenticated user
          res.body.items.forEach((post) => {
            expect(post.createdBy).toBe(testUser._id.toString());
          });
        });
    });

    it('should return 401 when not authenticated', () => {
      return request(app.getHttpServer())
        .get('/posts/me?page=1&per_page=2')
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toBe('Unauthorized');
        });
    });
  });

  describe('GET /posts/me/stats', () => {
    it('should return user post stats when authenticated', () => {
      return request(app.getHttpServer())
        .get('/posts/me/stats')
        .set(authHeader(authToken))
        .expect(200)
        .expect((res) => {
          expect(res.body.totalPosts).toBeDefined();
          expect(res.body.totalPostViews).toBeDefined();
          expect(res.body.totalPhoneViews).toBeDefined();
          expect(res.body.totalLineViews).toBeDefined();
          expect(res.body.totalShares).toBeDefined();
          expect(res.body.totalPins).toBeDefined();

          expect(res.body.totalPosts).toBe(10);
          expect(res.body.totalPostViews).toBe(10);
          expect(res.body.totalPhoneViews).toBe(10);
          expect(res.body.totalLineViews).toBe(10);
          expect(res.body.totalShares).toBe(10);
          expect(res.body.totalPins).toBe(10);
        });
    });

    it('should return 401 when not authenticated', () => {
      return request(app.getHttpServer())
        .get('/posts/me/stats')
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toBe('Unauthorized');
        });
    });
  });

  describe('GET /posts', () => {
    describe('Pagination Functionalities', () => {
      it('should return first 4 items when page=1, per_page=4', () => {
        return request(app.getHttpServer())
          .get('/posts?page=1&per_page=4')
          .set('x-api-key', API_KEY_FOR_NEXTJS_SERVER)
          .expect(200)
          .expect((res) => {
            expect(res.body.items).toBeDefined();
            expect(Array.isArray(res.body.items)).toBe(true);
            expect(res.body.items).toHaveLength(4);
            expect(res.body.total_count).toBe(10);
            expect(res.body.page).toBe(1);
            expect(res.body.per_page).toBe(4);

            expect(res.body.items[0].title).toBe(mockPosts[9].title);
            expect(res.body.items[1].title).toBe(mockPosts[8].title);
            expect(res.body.items[2].title).toBe(mockPosts[7].title);
            expect(res.body.items[3].title).toBe(mockPosts[6].title);
          });
      });

      it('should return second page (items 5-8) when page=2, per_page=4', () => {
        return request(app.getHttpServer())
          .get('/posts?page=2&per_page=4')
          .set('x-api-key', API_KEY_FOR_NEXTJS_SERVER)
          .expect(200)
          .expect((res) => {
            expect(res.body.items).toBeDefined();
            expect(Array.isArray(res.body.items)).toBe(true);
            expect(res.body.items).toHaveLength(4);
            expect(res.body.total_count).toBe(10);
            expect(res.body.page).toBe(2);
            expect(res.body.per_page).toBe(4);

            expect(res.body.items[0].title).toBe(mockPosts[5].title);
            expect(res.body.items[1].title).toBe(mockPosts[4].title);
            expect(res.body.items[2].title).toBe(mockPosts[3].title);
            expect(res.body.items[3].title).toBe(mockPosts[2].title);
          });
      });

      it('should return partial page (items 9-10) when page=3, per_page=4', () => {
        return request(app.getHttpServer())
          .get('/posts?page=3&per_page=4')
          .set('x-api-key', API_KEY_FOR_NEXTJS_SERVER)
          .expect(200)
          .expect((res) => {
            expect(res.body.items).toBeDefined();
            expect(Array.isArray(res.body.items)).toBe(true);
            expect(res.body.items).toHaveLength(2);
            expect(res.body.total_count).toBe(10);
            expect(res.body.page).toBe(3);
            expect(res.body.per_page).toBe(4);

            expect(res.body.items[0].title).toBe(mockPosts[1].title);
            expect(res.body.items[1].title).toBe(mockPosts[0].title);
          });
      });

      it('should return empty items array when page is beyond available items (page=999, per_page=4)', () => {
        return request(app.getHttpServer())
          .get('/posts?page=999&per_page=4')
          .set('x-api-key', API_KEY_FOR_NEXTJS_SERVER)
          .expect(200)
          .expect((res) => {
            expect(res.body.items).toBeDefined();
            expect(Array.isArray(res.body.items)).toBe(true);
            expect(res.body.items).toHaveLength(0);
            expect(res.body.total_count).toBe(10);
            expect(res.body.page).toBe(999);
            expect(res.body.per_page).toBe(4);
          });
      });
    });

    describe('API Key Validation', () => {
      it('should return 401 when API key is missing', () => {
        return request(app.getHttpServer())
          .get('/posts?page=1&per_page=4')
          .expect(401)
          .expect((res) => {
            expect(res.body.message).toBe('Invalid or missing API key');
          });
      });

      it('should return 401 when API key is invalid', () => {
        return request(app.getHttpServer())
          .get('/posts?page=1&per_page=4')
          .set('x-api-key', 'invalid-key')
          .expect(401)
          .expect((res) => {
            expect(res.body.message).toBe('Invalid or missing API key');
          });
      });

      it('should return 200 when API key is valid', () => {
        return request(app.getHttpServer())
          .get('/posts?page=1&per_page=4')
          .set('x-api-key', API_KEY_FOR_NEXTJS_SERVER)
          .expect(200)
          .expect((res) => {
            expect(res.body.items).toBeDefined();
            expect(res.body.total_count).toBeDefined();
          });
      });
    });

    describe('Pagination Validations', () => {
      it('should return 400 when both page and per_page are missing', () => {
        return request(app.getHttpServer())
          .get('/posts')
          .set('x-api-key', API_KEY_FOR_NEXTJS_SERVER)
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toContain('page should not be empty');
            expect(res.body.message).toContain('per_page should not be empty');
          });
      });

      it('should return 400 when page is missing', () => {
        return request(app.getHttpServer())
          .get('/posts?per_page=10')
          .set('x-api-key', API_KEY_FOR_NEXTJS_SERVER)
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toContain('page should not be empty');
          });
      });

      it('should return 400 when per_page is missing', () => {
        return request(app.getHttpServer())
          .get('/posts?page=1')
          .set('x-api-key', API_KEY_FOR_NEXTJS_SERVER)
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toContain('per_page should not be empty');
          });
      });

      it('should return 400 when page is not a number', () => {
        return request(app.getHttpServer())
          .get('/posts?page=abc&per_page=10')
          .set('x-api-key', API_KEY_FOR_NEXTJS_SERVER)
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toContain(
              'page must be an integer number'
            );
          });
      });

      it('should return 400 when per_page is not a number', () => {
        return request(app.getHttpServer())
          .get('/posts?page=1&per_page=abc')
          .set('x-api-key', API_KEY_FOR_NEXTJS_SERVER)
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toContain(
              'per_page must be an integer number'
            );
          });
      });

      it('should return 400 when page is less than 1', () => {
        return request(app.getHttpServer())
          .get('/posts?page=0&per_page=10')
          .set('x-api-key', API_KEY_FOR_NEXTJS_SERVER)
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toContain('page must not be less than 1');
          });
      });

      it('should return 400 when per_page is greater than 50', () => {
        return request(app.getHttpServer())
          .get('/posts?page=1&per_page=51')
          .set('x-api-key', API_KEY_FOR_NEXTJS_SERVER)
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toContain(
              'per_page must not be greater than 50'
            );
          });
      });

      it('should return 400 when per_page is less than 1', () => {
        return request(app.getHttpServer())
          .get('/posts?page=1&per_page=0')
          .set('x-api-key', API_KEY_FOR_NEXTJS_SERVER)
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toContain(
              'per_page must not be less than 1'
            );
          });
      });
    });

    describe('GET /posts/:postNumber', () => {
      it('should return a post when found', () => {
        const firstPost = mockPosts[0];
        return request(app.getHttpServer())
          .get(`/posts/${firstPost.postNumber}`)
          .set('x-api-key', API_KEY_FOR_NEXTJS_SERVER)
          .expect(200)
          .expect((res) => {
            expect(res.body._id).toBe(firstPost._id);
            expect(res.body.title).toBe('Luxury Condo in Bangkok');
            expect(res.body.stats.views.post).toBe(
              firstPost.stats.views.post + 1
            );
            expect(res.body.rstats).toBeUndefined();
          });
      });
      it('should return 404 when post is not found', () => {
        const notExistingPostNumber = 'not-exising-post-number';
        return request(app.getHttpServer())
          .get(`/posts/${notExistingPostNumber}`)
          .set('x-api-key', API_KEY_FOR_NEXTJS_SERVER)
          .expect(404)
          .expect({
            statusCode: 404,
            message: `Post with number ${notExistingPostNumber} not found`,
            error: 'Not Found'
          });
      });
    });

    describe('GET /posts/similar', () => {
      it('should return similar posts with correct length when found', () => {
        const condoFoRentPost = mockPosts.find(
          (post) =>
            post.assetType === AssetType.CONDO &&
            post.postType === PostType.RENT
        );

        if (!condoFoRentPost) {
          throw new Error('No condo for rent post found in mock data');
        }

        return request(app.getHttpServer())
          .get(`/posts/similar?postId=${condoFoRentPost._id}`)
          .set('x-api-key', API_KEY_FOR_NEXTJS_SERVER)
          .expect(200)
          .expect((res) => {
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(2);

            // Verify all returned posts have the same assetType and postType
            res.body.forEach((post) => {
              expect(post.assetType).toBe(AssetType.CONDO);
              expect(post.postType).toBe(PostType.RENT);
              expect(post._id).not.toBe(condoFoRentPost._id); // Should not include the original post
            });
          });
      });

      it('should return empty array when no similar posts found', () => {
        const townhomeForRent = mockPosts.find(
          (post) =>
            post.assetType === AssetType.TOWNHOME &&
            post.postType === PostType.RENT
        );

        if (!townhomeForRent) {
          throw new Error('No townhome for rent post found in mock data');
        }

        return request(app.getHttpServer())
          .get(`/posts/similar?postId=${townhomeForRent._id}`)
          .set('x-api-key', API_KEY_FOR_NEXTJS_SERVER)
          .expect(200)
          .expect((res) => {
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(0);
          });
      });

      it('should return 401 when API key is missing', () => {
        const firstPost = mockPosts[0];
        return request(app.getHttpServer())
          .get(`/posts/similar?postId=${firstPost._id}`)
          .expect(401)
          .expect((res) => {
            expect(res.body.message).toBe('Invalid or missing API key');
          });
      });
    });

    describe('POST /posts/:id/stats', () => {
      it('should increment shares for a post', async () => {
        const firstPost = mockPosts[0];
        const initialShares = firstPost.stats.shares;
        const initialRShares = firstPost.rstats.shares;

        await request(app.getHttpServer())
          .post(`/posts/${firstPost._id}/stats`)
          .send({ statType: PostStatType.SHARES })
          .expect(200);

        const postAfter = await postModel
          .findById(firstPost._id)
          .select('+rstats');
        expect(postAfter).toBeDefined();
        expect(postAfter!.stats.shares).toBe(initialShares + 1);
        expect(postAfter!.rstats.shares).toBe(initialRShares + 1);
      });

      it('should increment pins for a post', async () => {
        const firstPost = mockPosts[0];
        const initialPins = firstPost.stats.pins;
        const initialRPins = firstPost.rstats.pins;

        await request(app.getHttpServer())
          .post(`/posts/${firstPost._id}/stats`)
          .send({ statType: PostStatType.PINS })
          .expect(200);

        const postAfter = await postModel
          .findById(firstPost._id)
          .select('+rstats');
        expect(postAfter).toBeDefined();
        expect(postAfter!.stats.pins).toBe(initialPins + 1);
        expect(postAfter!.rstats.pins).toBe(initialRPins + 1);
      });

      it('should increment line views for a post', async () => {
        const firstPost = mockPosts[0];
        const initialLineViews = firstPost.stats.views.line;
        const initialRLineViews = firstPost.rstats.views.line;

        await request(app.getHttpServer())
          .post(`/posts/${firstPost._id}/stats`)
          .send({ statType: PostStatType.LINE_VIEWS })
          .expect(200);

        const postAfter = await postModel
          .findById(firstPost._id)
          .select('+rstats');
        expect(postAfter).toBeDefined();
        expect(postAfter!.stats.views.line).toBe(initialLineViews + 1);
        expect(postAfter!.rstats.views.line).toBe(initialRLineViews + 1);
      });

      it('should increment phone views for a post', async () => {
        const firstPost = mockPosts[0];
        const initialPhoneViews = firstPost.stats.views.phone;
        const initialRPhoneViews = firstPost.rstats.views.phone;

        await request(app.getHttpServer())
          .post(`/posts/${firstPost._id}/stats`)
          .send({ statType: PostStatType.PHONE_VIEWS })
          .expect(200);

        const postAfter = await postModel
          .findById(firstPost._id)
          .select('+rstats');
        expect(postAfter).toBeDefined();
        expect(postAfter!.stats.views.phone).toBe(initialPhoneViews + 1);
        expect(postAfter!.rstats.views.phone).toBe(initialRPhoneViews + 1);
      });

      it('should return 404 when post is not found', () => {
        const notExistingId = new Types.ObjectId().toString();
        return request(app.getHttpServer())
          .post(`/posts/${notExistingId}/stats`)
          .send({ statType: PostStatType.SHARES })
          .expect(404)
          .expect({
            statusCode: 404,
            message: `Post with ID ${notExistingId} not found`,
            error: 'Not Found'
          });
      });

      it('should return 400 when statType is missing', () => {
        const firstPost = mockPosts[0];
        return request(app.getHttpServer())
          .post(`/posts/${firstPost._id}/stats`)
          .send({})
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toContain('statType should not be empty');
          });
      });

      it('should return 400 when statType is invalid', () => {
        const firstPost = mockPosts[0];
        return request(app.getHttpServer())
          .post(`/posts/${firstPost._id}/stats`)
          .send({ statType: 'invalid_stat_type' })
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toContain(
              'statType must be one of the following values: shares, pins, phone_views, line_views'
            );
          });
      });
    });

    describe('GET /posts/:id/me', () => {
      it('should return a post when user owns it', () => {
        const firstPost = mockPosts[0];
        return request(app.getHttpServer())
          .get(`/posts/${firstPost._id}/me`)
          .set(authHeader(authToken))
          .expect(200)
          .expect((res) => {
            expect(res.body._id).toBe(firstPost._id);
            expect(res.body.title).toBe('Luxury Condo in Bangkok');
            expect(res.body.createdBy).toBe(testUser._id.toString());
          });
      });

      it('should return 403 when user does not own the post', async () => {
        // Create a second user
        const secondUser = createUser({ email: 'jane.doe@example.com' });
        const [, secondUserToken] = await createUserAndLogIn(
          secondUser,
          app,
          usersService
        );
        const firstPost = mockPosts[0]; // Owned by testUser
        return request(app.getHttpServer())
          .get(`/posts/${firstPost._id}/me`)
          .set(authHeader(secondUserToken))
          .expect(403)
          .expect((res) => {
            expect(res.body.message).toBe(
              'Access denied. You are not the owner of this post'
            );
          });
      });

      it('should return 401 when not authenticated', () => {
        const firstPost = mockPosts[0];
        return request(app.getHttpServer())
          .get(`/posts/${firstPost._id}/me`)
          .expect(401);
      });

      it('should return 404 when post is not found', () => {
        const notExistingId = new Types.ObjectId().toString();
        return request(app.getHttpServer())
          .get(`/posts/${notExistingId}/me`)
          .set(authHeader(authToken))
          .expect(404)
          .expect({
            statusCode: 404,
            message: `Post with ID ${notExistingId} not found`,
            error: 'Not Found'
          });
      });
    });
  });

  describe('POST /posts', () => {
    const validCreatePostDto: CreatePostDto = {
      postNumber: '1752291152',
      title: 'New post title',
      desc: '<p>This is desc</p>',
      assetType: AssetType.CONDO,
      postType: PostType.SALE,
      price: 1000.0,
      thumbnail: 'https://example.com/thumb.jpg',
      images: [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
        'https://example.com/image3.jpg'
      ],
      facilities: [
        { id: 'pool', label: 'Swimming Pool' },
        { id: 'gym', label: 'Gym' }
      ],
      specs: [
        { id: 'bedrooms', label: 'Bedrooms', value: 10.121 },
        { id: 'bathrooms', label: 'Bathrooms', value: 100.111 }
      ],
      address: {
        provinceId: '1',
        provinceLabel: 'Bangkok',
        districtId: '1',
        districtLabel: 'Watthana',
        subDistrictId: '1',
        subDistrictLabel: 'Khlong Toei Nuea',
        regionId: '1',
        location: {
          lat: 10.001,
          lng: 100.101
        }
      }
    };

    it('should create a new post successfully when authenticated', async () => {
      const response = await request(app.getHttpServer())
        .post('/posts')
        .set(authHeader(authToken))
        .send(validCreatePostDto)
        .expect(201);

      expect(response.body.title).toBe(validCreatePostDto.title);
      expect(response.body.desc).toBe('<p>This is desc</p>');
      expect(response.body.status).toBe('active');
      expect(response.body.postNumber).toBe(validCreatePostDto.postNumber);
      expect(response.body.createdBy).toBe(testUser._id.toString());

      const createdPostId = response.body._id;
      const postAction = await postActionsModel
        .findOne({
          postId: createdPostId
        })
        .sort({ createdAt: -1 });
      expect(postAction).toBeDefined();

      expect(postAction!.type).toBe(PostActionType.CREATE);
      expect(postAction!.from).toBe(PostStatus.EMPTY);
      expect(postAction!.to).toBe(PostStatus.ACTIVE);
      expect(postAction!.postId.toString()).toBe(createdPostId);
      expect(postAction!.createdBy.toString()).toBe(testUser._id.toString());
      expect(postAction!.note).toBe('');
    });

    it('should return 401 when not authenticated', () => {
      return request(app.getHttpServer())
        .post('/posts')
        .send(validCreatePostDto)
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toBe('Unauthorized');
        });
    });

    it('should return 400 when required fields are missing', () => {
      const invalidPost = {
        ...validCreatePostDto,
        postNumber: undefined,
        title: undefined,
        price: undefined
      };

      return request(app.getHttpServer())
        .post('/posts')
        .set(authHeader(authToken))
        .send(invalidPost)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('postNumber should not be empty');
          expect(res.body.message).toContain('title should not be empty');
          expect(res.body.message).toContain('price should not be empty');
        });
    });

    // Security Test: Prevent injecting non-whitelisted field
    it('should return 400 when dangerous premium field is sent', () => {
      const hackerPost = {
        ...validCreatePostDto,
        premium: true // Non-whitelisted
      };

      return request(app.getHttpServer())
        .post('/posts')
        .set(authHeader(authToken))
        .send(hackerPost)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain(
            'property premium should not exist'
          );
        });
    });

    it('should return 409 when postNumber already exists', async () => {
      const postNumber = '1752293116';
      // First create a post
      await request(app.getHttpServer())
        .post('/posts')
        .set(authHeader(authToken))
        .send({ ...validCreatePostDto, postNumber })
        .expect(201);

      // Try to create another post with the same postNumber
      return request(app.getHttpServer())
        .post('/posts')
        .set(authHeader(authToken))
        .send({ ...validCreatePostDto, postNumber })
        .expect(409)
        .expect((res) => {
          expect(res.body.message).toContain(
            `Post with postNumber ${postNumber} already exists`
          );
        });
    });

    it('should sanitize title and desc by removing malicious scripts while preserving allowed tags', async () => {
      const maliciousTitle =
        '<script>alert("XSS in title!")</script><strong>Bold Title</strong><div>Unwanted div</div>';
      const maliciousDesc = `
        <script>alert("XSS attack!")</script>
        <p>Safe paragraph</p>
        <strong>Bold text</strong>
        <em>Italic text</em>
        <u>Underlined text</u>
        <ol><li>First item</li><li>Second item</li></ol>
        <ul><li>Banana</li><li>Mango</li></ul>
        <br/>
        <a href="https://google.com">Google Link</a>
        <div style="color: red">Dangerous div with inline styles</div>
        <img src="x" onerror="alert('XSS')">
        <iframe src="javascript:alert('XSS')"></iframe>
        <style>body{background:red}</style>
        <link rel="stylesheet" href="malicious.css">
        <meta charset="utf-8">
        <svg onload="alert('XSS')">
        <object data="malicious.swf"></object>
        <embed src="malicious.swf">
        <form><input type="text"></form>
        <table><tr><td>Table content</td></tr></table>
        <h1>Heading not allowed</h1>
        <span>Span not allowed</span>
      `;

      const sanitizationTestPost = {
        ...validCreatePostDto,
        postNumber: '1752294000',
        title: maliciousTitle,
        desc: maliciousDesc
      };

      const response = await request(app.getHttpServer())
        .post('/posts')
        .set(authHeader(authToken))
        .send(sanitizationTestPost)
        .expect(201);

      // Expected sanitized title - should remove script, div tags but keep their content and preserve strong
      expect(response.body.title).toBe(
        '<strong>Bold Title</strong>Unwanted div'
      );
      expect(response.body.title).not.toContain('<script>');
      expect(response.body.title).not.toContain('<div>');
      expect(response.body.title).not.toContain('alert');

      // Expected sanitized desc - should preserve allowed tags and remove dangerous ones
      const sanitizedDesc = response.body.desc;

      // Should preserve allowed tags
      expect(sanitizedDesc).toContain('<p>Safe paragraph</p>');
      expect(sanitizedDesc).toContain('<strong>Bold text</strong>');
      expect(sanitizedDesc).toContain('<em>Italic text</em>');
      expect(sanitizedDesc).toContain('<u>Underlined text</u>');
      expect(sanitizedDesc).toContain(
        '<ol><li>First item</li><li>Second item</li></ol>'
      );
      expect(sanitizedDesc).toContain('<ul><li>Banana</li><li>Mango</li></ul>');
      expect(sanitizedDesc).toContain('<br />');
      expect(sanitizedDesc).toContain(
        '<a href="https://google.com">Google Link</a>'
      );

      // Should remove dangerous/malicious tags and scripts
      expect(sanitizedDesc).not.toContain('<script>');
      expect(sanitizedDesc).not.toContain('alert(');
      expect(sanitizedDesc).not.toContain('<div');
      expect(sanitizedDesc).not.toContain('style=');
      expect(sanitizedDesc).not.toContain('<img');
      expect(sanitizedDesc).not.toContain('onerror');
      expect(sanitizedDesc).not.toContain('<iframe');
      expect(sanitizedDesc).not.toContain('javascript:');
      expect(sanitizedDesc).not.toContain('<style>');
      expect(sanitizedDesc).not.toContain('<link');
      expect(sanitizedDesc).not.toContain('<meta');
      expect(sanitizedDesc).not.toContain('<svg');
      expect(sanitizedDesc).not.toContain('onload');
      expect(sanitizedDesc).not.toContain('<object');
      expect(sanitizedDesc).not.toContain('<embed');
      expect(sanitizedDesc).not.toContain('<form');
      expect(sanitizedDesc).not.toContain('<input');
      expect(sanitizedDesc).not.toContain('<table');
      expect(sanitizedDesc).not.toContain('<h1>');
      expect(sanitizedDesc).not.toContain('<span>');

      // Content should still be there, just without dangerous tags
      // sanitize-html removes tags but preserves text content
      expect(sanitizedDesc).toContain('Dangerous div with inline styles');
      expect(sanitizedDesc).toContain('Table content');
      expect(sanitizedDesc).toContain('Heading not allowed');
      expect(sanitizedDesc).toContain('Span not allowed');
    });
  });

  describe('POST /posts/search', () => {
    it('should return posts filtered by assetType and postType', async () => {
      const res = await request(app.getHttpServer())
        .post('/posts/search')
        .send({ assetType: AssetType.CONDO, postType: PostType.RENT })
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(3);
      res.body.forEach((post) => {
        expect(post.assetType).toBe(AssetType.CONDO);
        expect(post.postType).toBe(PostType.RENT);
      });
    });

    it('should return posts filtered by assetType, postType and regionId', async () => {
      const res = await request(app.getHttpServer())
        .post('/posts/search')
        .send({
          assetType: AssetType.CONDO,
          postType: PostType.RENT,
          regionId: 'r5'
        })
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      res.body.forEach((post) => {
        expect(post.assetType).toBe(AssetType.CONDO);
        expect(post.postType).toBe(PostType.RENT);
        expect(post.address.regionId).toBe('r5');
      });
    });

    it('should return posts filtered by assetType, postType and provinceId', async () => {
      const res = await request(app.getHttpServer())
        .post('/posts/search')
        .send({
          assetType: AssetType.CONDO,
          postType: PostType.RENT,
          provinceId: 'p11'
        })
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      res.body.forEach((post) => {
        expect(post.assetType).toBe(AssetType.CONDO);
        expect(post.postType).toBe(PostType.RENT);
        expect(post.address.regionId).toBe('r5');
        expect(post.address.provinceId).toBe('p11');
      });
    });

    it('should return posts filtered by assetType, postType and districtId', async () => {
      const res = await request(app.getHttpServer())
        .post('/posts/search')
        .send({
          assetType: AssetType.CONDO,
          postType: PostType.RENT,
          districtId: 'd2007'
        })
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      res.body.forEach((post) => {
        expect(post.assetType).toBe(AssetType.CONDO);
        expect(post.postType).toBe(PostType.RENT);
        expect(post.address.regionId).toBe('r5');
        expect(post.address.provinceId).toBe('p11');
        expect(post.address.districtId).toBe('d2007');
      });
    });

    it('should return posts filtered by assetType, postType and subDistrictId', async () => {
      const res = await request(app.getHttpServer())
        .post('/posts/search')
        .send({
          assetType: AssetType.CONDO,
          postType: PostType.RENT,
          subDistrictId: 's200702'
        })
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      res.body.forEach((post) => {
        expect(post.assetType).toBe(AssetType.CONDO);
        expect(post.postType).toBe(PostType.RENT);
        expect(post.address.regionId).toBe('r5');
        expect(post.address.provinceId).toBe('p11');
        expect(post.address.districtId).toBe('d2007');
        expect(post.address.subDistrictId).toBe('s200702');
      });
    });

    it('should return empty array for non-existing assetType and postType', async () => {
      const res = await request(app.getHttpServer())
        .post('/posts/search')
        .send({
          assetType: AssetType.LAND,
          postType: PostType.RENT
        })
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });

    it('should return 400 if postType is missing', async () => {
      const res = await request(app.getHttpServer())
        .post('/posts/search')
        .send({ assetType: AssetType.CONDO })
        .expect(400);
      expect(res.body.message).toContain('postType should not be empty');
    });

    it('should return 400 if assetType is missing', async () => {
      const res = await request(app.getHttpServer())
        .post('/posts/search')
        .send({ postType: PostType.RENT })
        .expect(400);
      expect(res.body.message).toContain('assetType should not be empty');
    });

    it('should return 400 if both required fields are missing', async () => {
      const res = await request(app.getHttpServer())
        .post('/posts/search')
        .send({})
        .expect(400);
      expect(res.body.message).toContain('postType should not be empty');
      expect(res.body.message).toContain('assetType should not be empty');
    });
  });

  describe('PATCH /posts/:id', () => {
    let existingPost: Post;

    beforeEach(async () => {
      const post = await postModel.findOne();
      if (!post) {
        throw new Error('No test post found');
      }
      existingPost = post;
    });

    const validUpdatePostDto = {
      title: 'Updated post title',
      desc: `<script>alert("XSS attack!")</script><p>Updated paragraph</p><a href="https://google.com">Updated Google Link</a>`,
      assetType: AssetType.HOUSE,
      postType: PostType.RENT,
      price: 99999.99,
      thumbnail: 'https://example.com/thumb_updated.jpg',
      images: [
        'https://example.com/image1_updated.jpg',
        'https://example.com/image2_updated.jpg',
        'https://example.com/image3_updated.jpg'
      ],
      facilities: [
        { id: 'pool', label: 'Swimming Pool_updated' },
        { id: 'gym', label: 'Gym_updated' }
      ],
      specs: [
        { id: 'bedrooms', label: 'Bedrooms', value: 99 },
        { id: 'bathrooms', label: 'Bathrooms', value: 99.99 }
      ],
      address: {
        provinceId: '1',
        provinceLabel: 'Bangkok_updated',
        districtId: '1',
        districtLabel: 'Watthana_updated',
        subDistrictId: '1',
        subDistrictLabel: 'Khlong Toei Nuea_updated',
        regionId: '1',
        location: {
          lat: 99.989,
          lng: 999.949
        }
      }
    };

    it('should update post successfully when pass all post fields and authenticated', async () => {
      const sendEmailSpy = jest.spyOn(mailService, 'sendEmail');

      const beforeUpdate = new Date();

      const response = await request(app.getHttpServer())
        .patch(`/posts/${existingPost._id}`)
        .set(authHeader(authToken))
        .send(validUpdatePostDto)
        .expect(200);

      expect(response.body.title).toBe(validUpdatePostDto.title);
      expect(response.body.desc).toBe(
        '<p>Updated paragraph</p><a href="https://google.com">Updated Google Link</a>'
      );
      expect(response.body.assetType).toBe(validUpdatePostDto.assetType);
      expect(response.body.postType).toBe(validUpdatePostDto.postType);
      expect(response.body.price).toBe(validUpdatePostDto.price);
      expect(response.body.status).toBe('active');
      expect(response.body.thumbnail).toBe(validUpdatePostDto.thumbnail);
      expect(JSON.stringify(response.body.images)).toBe(
        JSON.stringify(validUpdatePostDto.images)
      );
      expect(JSON.stringify(response.body.facilities)).toBe(
        JSON.stringify(validUpdatePostDto.facilities)
      );
      expect(JSON.stringify(response.body.specs)).toBe(
        JSON.stringify(validUpdatePostDto.specs)
      );
      expect(validUpdatePostDto.address.provinceLabel).toBe(
        validUpdatePostDto.address.provinceLabel
      );

      expect(response.body.updatedBy).toBe(testUser._id.toString());
      expect(new Date(response.body.updatedAt)).toBeInstanceOf(Date);
      expect(new Date(response.body.updatedAt).getTime()).toBeGreaterThan(
        beforeUpdate.getTime()
      );

      const updatedPost = await postModel.findById(existingPost._id);
      expect(updatedPost).toBeDefined();
      expect(updatedPost?.title).toBe(validUpdatePostDto.title);

      const updatedPostId = response.body._id;
      const postAction = await postActionsModel
        .findOne({
          postId: updatedPostId
        })
        .sort({ createdAt: -1 });
      expect(postAction).toBeDefined();

      const expectedAction = POST_ACTIONS_FLOW.find(
        (paf) => paf.action === PostActionType.UPDATE
      );
      expect(expectedAction).toBeDefined();

      expect(postAction!.type).toBe(PostActionType.UPDATE);
      expect(postAction!.from).toBe(PostStatus.ACTIVE);
      expect(postAction!.to).toBe(PostStatus.ACTIVE);
      expect(postAction!.postId.toString()).toBe(updatedPostId);
      expect(postAction!.createdBy.toString()).toBe(testUser._id.toString());
      expect(postAction!.note).toBe('');

      expect(sendEmailSpy).toHaveBeenCalled();
    });

    it('should update post successfully when pass only title and authenticated', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/posts/${existingPost._id}`)
        .set(authHeader(authToken))
        .send({ title: 'Title updated22' })
        .expect(200);

      expect(response.body.title).toBe('Title updated22');
    });

    it('should return 401 when not authenticated', () => {
      return request(app.getHttpServer())
        .patch(`/posts/${existingPost._id}`)
        .send(validUpdatePostDto)
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toBe('Unauthorized');
        });
    });

    it('should return 404 when post does not exist', () => {
      const nonExistentId = new Types.ObjectId().toString();
      return request(app.getHttpServer())
        .patch(`/posts/${nonExistentId}`)
        .set(authHeader(authToken))
        .send(validUpdatePostDto)
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toBe(
            `Post with ID ${nonExistentId} not found`
          );
        });
    });

    it('should return 400 when required fields are missing', () => {
      const invalidUpdate = {
        title: ''
      };

      return request(app.getHttpServer())
        .patch(`/posts/${existingPost._id}`)
        .set(authHeader(authToken))
        .send(invalidUpdate)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('title should not be empty');
        });
    });

    it('should return 400 when non-nullable fields are null or empty', () => {
      return request(app.getHttpServer())
        .patch(`/posts/${existingPost._id}`)
        .set(authHeader(authToken))
        .send({ title: null, desc: '' })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('title must be a string');
          expect(res.body.message).toContain('desc should not be empty');
        });
    });
  });

  describe('POST /posts/:id/close', () => {
    let activePost: Post;

    beforeEach(async () => {
      // Ensure we have an active post by updating one to ACTIVE status
      const post = await postModel.findOne({
        createdBy: testUser._id,
        status: PostStatus.ACTIVE
      });
      if (!post) {
        throw new Error('No test post found');
      }
      activePost = post!;
    });

    it('should close post successfully when authenticated and user owns the post', async () => {
      await request(app.getHttpServer())
        .post(`/posts/${activePost._id}/close`)
        .set(authHeader(authToken))
        .expect(200);

      // Verify post status changed to closed
      const closedPost = await postModel.findById(activePost._id);
      expect(closedPost).toBeDefined();
      expect(closedPost?.status).toBe(PostStatus.CLOSED);

      // Verify postAction was created
      const postAction = await postActionsModel
        .findOne({
          postId: activePost._id
        })
        .sort({ createdAt: -1 });

      expect(postAction).toBeDefined();
      expect(postAction!.type).toBe(PostActionType.CLOSE);
      expect(postAction!.from).toBe(PostStatus.ACTIVE);
      expect(postAction!.to).toBe(PostStatus.CLOSED);
      expect(postAction!.postId.toString()).toBe(activePost._id.toString());
      expect(postAction!.createdBy.toString()).toBe(testUser._id.toString());
      expect(postAction!.note).toBe('');
    });

    it('should return 401 when not authenticated', () => {
      return request(app.getHttpServer())
        .post(`/posts/${activePost._id}/close`)
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toBe('Unauthorized');
        });
    });

    it('should return 403 when user does not own the post', async () => {
      // Create a second user
      const secondUser = createUser({ email: 'close.test@example.com' });
      const [, secondUserToken] = await createUserAndLogIn(
        secondUser,
        app,
        usersService
      );

      return request(app.getHttpServer())
        .post(`/posts/${activePost._id}/close`)
        .set(authHeader(secondUserToken))
        .expect(403)
        .expect((res) => {
          expect(res.body.message).toBe(
            'Access denied. You are not the owner of this post'
          );
        });
    });

    it('should return 404 when post does not exist', () => {
      const nonExistentId = new Types.ObjectId().toString();
      return request(app.getHttpServer())
        .post(`/posts/${nonExistentId}/close`)
        .set(authHeader(authToken))
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toBe(
            `Post with ID ${nonExistentId} not found`
          );
        });
    });
  });

  describe('Sitemap Endpoints', () => {
    it('should return the latest active post with valid API key', async () => {
      const res = await request(app.getHttpServer())
        .get('/posts/latest-active-sitemap')
        .set('x-api-key', API_KEY_FOR_NEXTJS_SERVER)
        .expect(200);
      expect(res.body).toBeDefined();
      expect(res.body._id).toBeDefined();
      expect(res.body.slug).toBeDefined();
      expect(res.body.createdAt).toBeDefined();
    });

    it('should return 401 for latest-active-sitemap with missing API key', async () => {
      await request(app.getHttpServer())
        .get('/posts/latest-active-sitemap')
        .expect(401);
    });

    it('should return all active posts for sitemap with valid API key', async () => {
      const res = await request(app.getHttpServer())
        .get('/posts/all-active-sitemap')
        .set('x-api-key', API_KEY_FOR_NEXTJS_SERVER)
        .expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(10);
      res.body.forEach((post) => {
        expect(post._id).toBeDefined();
        expect(post.slug).toBeDefined();
        expect(post.createdAt).toBeDefined();
      });
    });

    it('should return 401 for all-active-sitemap with missing API key', async () => {
      await request(app.getHttpServer())
        .get('/posts/all-active-sitemap')
        .expect(401);
    });
  });
});
