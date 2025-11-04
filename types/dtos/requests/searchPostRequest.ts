import { AssetType, PostType } from '@/types/models/post';

export interface SearchPostRequest {
  assetType: AssetType;
  postType: PostType;
  regionId: string;
  provinceId?: string;
  districtId?: string;
  subDistrictId?: string;
}
