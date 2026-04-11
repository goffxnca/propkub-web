import { IsInt, Min, Max, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @IsNotEmpty()
  page: number;

  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(50)
  @IsNotEmpty()
  per_page: number;
}
