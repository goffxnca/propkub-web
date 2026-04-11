import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { SubDistrictsService } from './subDistricts.service';
import { SubDistrict } from './subDistricts.schema';

@Controller('subdistricts')
export class SubDistrictsController {
  constructor(private readonly subDistrictsService: SubDistrictsService) {}

  @Get()
  findAll(): Promise<SubDistrict[]> {
    return this.subDistrictsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SubDistrict> {
    const subdistrict = await this.subDistrictsService.findOne(id);
    if (!subdistrict) {
      throw new NotFoundException(`SubDistrict with ID ${id} not found`);
    }
    return subdistrict;
  }

  @Get('district/:districtId')
  findByDistrictId(
    @Param('districtId') districtId: string
  ): Promise<SubDistrict[]> {
    return this.subDistrictsService.findByDistrictId(districtId);
  }
}
