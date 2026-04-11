import { Test, TestingModule } from '@nestjs/testing';
import { DistrictsService } from '../../src/districts/districts.service';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { District } from '../../src/districts/districts.schema';
import {
  rootMongooseTestModule,
  closeMongodConnection
} from '../utils/mongodb-memory';
import { DistrictsModule } from '../../src/districts/districts.module';
import { ConfigModule } from '@nestjs/config';

describe('Districts (e2e)', () => {
  let app: INestApplication;
  let service: DistrictsService;

  const testDistricts: District[] = [
    { id: '1', name: 'Bang Rak', provinceId: '1' },
    { id: '2', name: 'Pathum Wan', provinceId: '1' },
    { id: '3', name: 'Mueang Chiang Mai', provinceId: '2' }
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.test' }),
        rootMongooseTestModule(),
        DistrictsModule
      ]
    }).compile();

    app = moduleFixture.createNestApplication();
    service = moduleFixture.get<DistrictsService>(DistrictsService);
    await app.init();

    for (const district of testDistricts) {
      await service.seedTest(district);
    }
  });

  afterAll(async () => {
    await app.close();
    await closeMongodConnection();
  });

  describe('GET /districts', () => {
    it('should return 3 districts', () => {
      return request(app.getHttpServer())
        .get('/districts')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(3);

          const districts = res.body as District[];

          const district1 = districts.find((d) => d.id === '1');
          expect(district1).toBeDefined();
          if (district1) {
            expect(district1._id).toBeDefined();
            expect(district1.id).toBe('1');
            expect(district1.name).toBe('Bang Rak');
            expect(district1.provinceId).toBe('1');
          }

          const district2 = districts.find((d) => d.id === '2');
          expect(district2).toBeDefined();
          if (district2) {
            expect(district2._id).toBeDefined();
            expect(district2.id).toBe('2');
            expect(district2.name).toBe('Pathum Wan');
            expect(district2.provinceId).toBe('1');
          }

          const district3 = districts.find((d) => d.id === '3');
          expect(district3).toBeDefined();
          if (district3) {
            expect(district3._id).toBeDefined();
            expect(district3.id).toBe('3');
            expect(district3.name).toBe('Mueang Chiang Mai');
            expect(district3.provinceId).toBe('2');
          }
        });
    });
  });

  describe('GET /districts/:id', () => {
    it('should return a district when found', () => {
      return request(app.getHttpServer())
        .get('/districts/1')
        .expect(200)
        .expect((res) => {
          const district = res.body as District;

          expect(district._id).toBeDefined();
          expect(district.id).toBe('1');
          expect(district.name).toBe('Bang Rak');
          expect(district.provinceId).toBe('1');
        });
    });

    it('should return 404 when district is not found', () => {
      return request(app.getHttpServer())
        .get('/districts/nonexistent-id')
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toContain('not found');
        });
    });
  });

  describe('GET /districts/province/:provinceId', () => {
    it('should return districts for a province', () => {
      return request(app.getHttpServer())
        .get('/districts/province/1')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(2);

          const districts = res.body as District[];
          expect(districts.every((d) => d.provinceId === '1')).toBe(true);

          const districtIds = districts.map((d) => d.id);
          expect(districtIds).toContain('1');
          expect(districtIds).toContain('2');
        });
    });

    it('should return empty array for non-existent province', () => {
      return request(app.getHttpServer())
        .get('/districts/province/999')
        .expect(200)
        .expect([]);
    });
  });
});
