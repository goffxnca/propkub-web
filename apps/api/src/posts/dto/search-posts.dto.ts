import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AssetType, PostType } from '../posts.schema';

export class SearchPostsDto {
  @IsNotEmpty()
  @IsEnum(AssetType)
  assetType: AssetType;

  @IsNotEmpty()
  @IsEnum(PostType)
  postType: PostType;

  // Optional location fields - if provided, must not be empty
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  regionId: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  provinceId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  districtId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  subDistrictId?: string;
}
