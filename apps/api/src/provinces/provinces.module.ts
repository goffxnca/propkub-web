import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProvincesService } from './provinces.service';
import { ProvincesController } from './provinces.controller';
import { Province, ProvinceSchema } from './provinces.schema';
import { EnvironmentModule } from '../environments/environment.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Province.name, schema: ProvinceSchema }
    ]),
    EnvironmentModule
  ],
  providers: [ProvincesService],
  controllers: [ProvincesController]
})
export class ProvincesModule {}
