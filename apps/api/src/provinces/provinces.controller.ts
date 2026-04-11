import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ProvincesService } from './provinces.service';
import { Province } from './provinces.schema';

@Controller('provinces')
export class ProvincesController {
  constructor(private readonly provincesService: ProvincesService) {}

  @Get()
  findAll(): Promise<Province[]> {
    return this.provincesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Province> {
    const province = await this.provincesService.findOne(id);
    if (!province) {
      throw new NotFoundException(`Province with ID ${id} not found`);
    }
    return province;
  }
}
