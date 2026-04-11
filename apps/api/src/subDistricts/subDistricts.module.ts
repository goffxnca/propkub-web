import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubDistrictsService } from './subDistricts.service';
import { SubDistrictsController } from './subDistricts.controller';
import { SubDistrict, SubDistrictSchema } from './subDistricts.schema';
import { EnvironmentModule } from '../environments/environment.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubDistrict.name, schema: SubDistrictSchema }
    ]),
    EnvironmentModule
  ],
  providers: [SubDistrictsService],
  controllers: [SubDistrictsController]
})
export class SubDistrictsModule {}
