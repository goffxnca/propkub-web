import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DistrictsService } from './districts.service';
import { DistrictsController } from './districts.controller';
import { District, DistrictSchema } from './districts.schema';
import { EnvironmentModule } from '../environments/environment.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: District.name, schema: DistrictSchema }
    ]),
    EnvironmentModule
  ],
  providers: [DistrictsService],
  controllers: [DistrictsController]
})
export class DistrictsModule {}
