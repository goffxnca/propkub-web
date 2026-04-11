import { Test, TestingModule } from '@nestjs/testing';
import { ProvincesService } from '../../src/provinces/provinces.service';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Province } from '../../src/provinces/provinces.schema';
import {
  rootMongooseTestModule,
  closeMongodConnection
} from '../utils/mongodb-memory';
import { ProvincesModule } from '../../src/provinces/provinces.module';
import { ConfigModule } from '@nestjs/config';

describe('Provinces (e2e)', () => {
  let app: INestApplication;
  let service: ProvincesService;

  const testProvinces: Province[] = [
    { id: '1', name: 'Bangkok', regionId: '1' },
    { id: '2', name: 'Chiang Mai', regionId: '2' }
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.test' }),
        rootMongooseTestModule(),
        ProvincesModule
      ]
    }).compile();

    app = moduleFixture.createNestApplication();
    service = moduleFixture.get<ProvincesService>(ProvincesService);
    await app.init();

    for (const province of testProvinces) {
      await service.seedTest(province);
    }
  });

  afterAll(async () => {
    await app.close();
    await closeMongodConnection();
  });

  describe('GET /provinces', () => {
    it('should return 2 provinces', () => {
      return request(app.getHttpServer())
        .get('/provinces')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(2);

          const provinces = res.body as Province[];
          const province1 = provinces.find((p) => p.id === '1');
          const province2 = provinces.find((p) => p.id === '2');

          expect(province1).toBeDefined();
          if (province1) {
            expect(province1._id).toBeDefined();
            expect(province1.id).toBe('1');
            expect(province1.name).toBe('Bangkok');
            expect(province1.regionId).toBe('1');
          }

          expect(province2).toBeDefined();
          if (province2) {
            expect(province2._id).toBeDefined();
            expect(province2.id).toBe('2');
            expect(province2.name).toBe('Chiang Mai');
            expect(province2.regionId).toBe('2');
          }
        });
    });
  });

  describe('GET /provinces/:id', () => {
    it('should return a province when found', () => {
      return request(app.getHttpServer())
        .get('/provinces/1')
        .expect(200)
        .expect((res) => {
          const province = res.body as Province;
          expect(province._id).toBeDefined();
          expect(province.id).toBe('1');
          expect(province.name).toBe('Bangkok');
          expect(province.regionId).toBe('1');
        });
    });

    it('should return 404 when province is not found', () => {
      return request(app.getHttpServer())
        .get('/provinces/nonexistent-id')
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toContain('not found');
        });
    });
  });
});
