import { Test, TestingModule } from '@nestjs/testing';
import { SubDistrictsService } from '../../src/subDistricts/subDistricts.service';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { SubDistrict } from '../../src/subDistricts/subDistricts.schema';
import {
  rootMongooseTestModule,
  closeMongodConnection
} from '../utils/mongodb-memory';
import { SubDistrictsModule } from '../../src/subDistricts/subDistricts.module';
import { ConfigModule } from '@nestjs/config';

describe('SubDistricts (e2e)', () => {
  let app: INestApplication;
  let service: SubDistrictsService;

  const testSubDistricts: SubDistrict[] = [
    { id: '1', name: 'Grand Palace', districtId: '1' },
    { id: '2', name: 'Wang Burapha', districtId: '1' },
    { id: '3', name: 'Wat Ratchabophit', districtId: '1' }
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.test' }),
        rootMongooseTestModule(),
        SubDistrictsModule
      ]
    }).compile();

    app = moduleFixture.createNestApplication();
    service = moduleFixture.get<SubDistrictsService>(SubDistrictsService);
    await app.init();

    for (const subDistrict of testSubDistricts) {
      await service.seedTest(subDistrict);
    }
  });

  afterAll(async () => {
    await app.close();
    await closeMongodConnection();
  });

  describe('GET /subdistricts', () => {
    it('should return 3 subdistricts', () => {
      return request(app.getHttpServer())
        .get('/subdistricts')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(3);

          const subDistricts = res.body as SubDistrict[];

          const subDistrict1 = subDistricts.find((s) => s.id === '1');
          expect(subDistrict1).toBeDefined();
          if (subDistrict1) {
            expect(subDistrict1._id).toBeDefined();
            expect(subDistrict1.id).toBe('1');
            expect(subDistrict1.name).toBe('Grand Palace');
            expect(subDistrict1.districtId).toBe('1');
          }

          const subDistrict2 = subDistricts.find((s) => s.id === '2');
          expect(subDistrict2).toBeDefined();
          if (subDistrict2) {
            expect(subDistrict2._id).toBeDefined();
            expect(subDistrict2.id).toBe('2');
            expect(subDistrict2.name).toBe('Wang Burapha');
            expect(subDistrict2.districtId).toBe('1');
          }

          const subDistrict3 = subDistricts.find((s) => s.id === '3');
          expect(subDistrict3).toBeDefined();
          if (subDistrict3) {
            expect(subDistrict3._id).toBeDefined();
            expect(subDistrict3.id).toBe('3');
            expect(subDistrict3.name).toBe('Wat Ratchabophit');
            expect(subDistrict3.districtId).toBe('1');
          }
        });
    });
  });

  describe('GET /subdistricts/:id', () => {
    it('should return a subdistrict when found', () => {
      return request(app.getHttpServer())
        .get('/subdistricts/1')
        .expect(200)
        .expect((res) => {
          const subDistrict = res.body as SubDistrict;

          expect(subDistrict._id).toBeDefined();
          expect(subDistrict.id).toBe('1');
          expect(subDistrict.name).toBe('Grand Palace');
          expect(subDistrict.districtId).toBe('1');
        });
    });

    it('should return 404 when subdistrict is not found', () => {
      return request(app.getHttpServer())
        .get('/subdistricts/nonexistent-id')
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toContain('not found');
        });
    });
  });

  describe('GET /subdistricts/district/:districtId', () => {
    it('should return subdistricts for a district', () => {
      return request(app.getHttpServer())
        .get('/subdistricts/district/1')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(3);

          const subDistricts = res.body as SubDistrict[];
          expect(subDistricts.every((s) => s.districtId === '1')).toBe(true);

          const subDistrictIds = subDistricts.map((s) => s.id);
          expect(subDistrictIds).toContain('1');
          expect(subDistrictIds).toContain('2');
          expect(subDistrictIds).toContain('3');
        });
    });

    it('should return empty array for non-existent district', () => {
      return request(app.getHttpServer())
        .get('/subdistricts/district/999')
        .expect(200)
        .expect([]);
    });
  });
});
