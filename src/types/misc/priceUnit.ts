import { PostType } from './postType';

export interface PriceUnit {
  id: string;
  label: string;
}

export interface PricePerUnitMapping {
  assetType: string;
  postType: PostType['id'];
  units: PriceUnit[];
} 