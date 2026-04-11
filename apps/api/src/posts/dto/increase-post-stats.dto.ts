import { IsEnum, IsNotEmpty } from 'class-validator';

export enum PostStatType {
  SHARES = 'shares',
  PINS = 'pins',
  PHONE_VIEWS = 'phone_views',
  LINE_VIEWS = 'line_views'
}

export class IncreasePostStatsDto {
  @IsNotEmpty()
  @IsEnum(PostStatType)
  statType: PostStatType;
}
