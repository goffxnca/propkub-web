import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import {
  Address,
  AreaUnit,
  AssetType,
  Condition,
  Facility,
  PostType,
  Spec,
  TimeUnit
} from '../posts.schema';
import { Type } from 'class-transformer';

export class CreatePostDto {
  // Required

  // Unix timestamp used for Firebase Storage folder structure (po/{postNumber}/image.jpg)
  // Frontend generates this, uploads images, then calls API with same postNumber
  @IsNotEmpty()
  @IsString()
  postNumber: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  desc: string;

  @IsNotEmpty()
  @IsEnum(AssetType)
  assetType: string;

  @IsNotEmpty()
  @IsEnum(PostType)
  postType: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  thumbnail: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(3)
  images: string[];

  @IsNotEmpty()
  @IsArray()
  @ValidateNested()
  @Type(() => Facility)
  facilities: Facility[];

  @IsNotEmpty()
  @IsArray()
  @ValidateNested()
  @Type(() => Spec)
  specs: Spec[];

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Address)
  address: Address;

  // Optional
  @IsOptional()
  @IsBoolean()
  isStudio?: boolean;

  @IsOptional()
  @IsString()
  video?: string;

  @IsOptional()
  @IsNumber()
  land?: number;

  @IsOptional()
  @IsEnum(AreaUnit)
  landUnit?: string;

  @IsOptional()
  @IsNumber()
  area?: number;

  @IsOptional()
  @IsEnum(AreaUnit)
  areaUnit?: string;

  @IsOptional()
  @IsEnum({ ...AreaUnit, ...TimeUnit })
  priceUnit?: string;

  @IsOptional()
  @IsEnum(Condition)
  condition?: string;

  @IsOptional()
  @IsString()
  refId?: string;
}
