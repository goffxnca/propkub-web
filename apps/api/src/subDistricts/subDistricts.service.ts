import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubDistrict, SubDistrictDocument } from './subDistricts.schema';
import * as subDistrictsData from './data/subDistricts.json';
import { EnvironmentService } from '../environments/environment.service';

@Injectable()
export class SubDistrictsService implements OnModuleInit {
  constructor(
    @InjectModel(SubDistrict.name)
    private readonly subDistrictModel: Model<SubDistrictDocument>,
    private readonly envService: EnvironmentService
  ) {}

  async onModuleInit() {
    if (this.envService.isTest()) {
      return;
    }

    const count = await this.subDistrictModel.estimatedDocumentCount();
    if (count === 0) {
      await this.subDistrictModel.insertMany(subDistrictsData);
      console.log(`✅ Seeded ${subDistrictsData.length} subdistricts.`);
    }
  }

  async findAll(): Promise<SubDistrict[]> {
    return this.subDistrictModel.find().exec();
  }

  async findOne(id: string): Promise<SubDistrict | null> {
    return this.subDistrictModel.findOne({ id }).exec();
  }

  async findByDistrictId(districtId: string): Promise<SubDistrict[]> {
    return this.subDistrictModel.find({ districtId }).sort({ name: 1 }).exec();
  }

  async seedTest(subDistrict: Partial<SubDistrict>): Promise<SubDistrict> {
    const newSubDistrict = new this.subDistrictModel(subDistrict);
    return newSubDistrict.save();
  }
}
