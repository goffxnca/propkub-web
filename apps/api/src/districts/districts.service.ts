import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { District, DistrictDocument } from './districts.schema';
import * as districtsData from './data/districts.json';
import { EnvironmentService } from '../environments/environment.service';

@Injectable()
export class DistrictsService implements OnModuleInit {
  constructor(
    @InjectModel(District.name) private districtModel: Model<DistrictDocument>,
    private readonly envService: EnvironmentService
  ) {}

  async onModuleInit() {
    if (this.envService.isTest()) {
      return;
    }

    const count = await this.districtModel.estimatedDocumentCount();
    if (count === 0) {
      await this.districtModel.insertMany(districtsData);
      console.log(`✅ Seeded ${districtsData.length} districts.`);
    }
  }

  async findAll(): Promise<District[]> {
    return this.districtModel.find().exec();
  }

  async findOne(id: string): Promise<District | null> {
    return this.districtModel.findOne({ id }).exec();
  }

  async findByProvinceId(provinceId: string): Promise<District[]> {
    return this.districtModel.find({ provinceId }).sort({ name: 1 }).exec();
  }

  async seedTest(district: Partial<District>): Promise<District> {
    const newDistrict = new this.districtModel(district);
    return newDistrict.save();
  }
}
