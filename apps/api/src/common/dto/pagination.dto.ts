import { IsInt, Min, Max, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(50)
  @IsNotEmpty()
  limit: number;

  @IsInt()
  @Type(() => Number)
  @Min(0)
  @IsNotEmpty()
  offset: number;
}
