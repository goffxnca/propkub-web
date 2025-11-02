import { AssetType, PostType } from '../../models/post';

export interface SearchPostRequest {
  assetType: AssetType;
  postType: PostType;
  regionId: string;
  provinceId?: string;
  districtId?: string;
  subDistrictId?: string;
}
