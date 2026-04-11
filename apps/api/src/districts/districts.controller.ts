import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { DistrictsService } from './districts.service';
import { District } from './districts.schema';

@Controller('districts')
export class DistrictsController {
  constructor(private readonly districtsService: DistrictsService) {}

  @Get()
  findAll(): Promise<District[]> {
    return this.districtsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<District> {
    const district = await this.districtsService.findOne(id);
    if (!district) {
      throw new NotFoundException(`District with ID ${id} not found`);
    }
    return district;
  }

  @Get('province/:provinceId')
  findByProvinceId(
    @Param('provinceId') provinceId: string
  ): Promise<District[]> {
    return this.districtsService.findByProvinceId(provinceId);
  }
}
