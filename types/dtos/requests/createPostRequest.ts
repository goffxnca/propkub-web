import { Post } from '../../models/post';

type CreatePostRequiredKeys =
  | 'postNumber'
  | 'title'
  | 'desc'
  | 'assetType'
  | 'postType'
  | 'price'
  | 'thumbnail'
  | 'images'
  | 'facilities'
  | 'specs'
  | 'address';

type CreatePostOptionalKeys =
  | 'isStudio'
  | 'video'
  | 'land'
  | 'landUnit'
  | 'area'
  | 'areaUnit'
  | 'priceUnit'
  | 'condition'
  | 'refId';

export type CreatePostRequest = Pick<Post, CreatePostRequiredKeys> &
  Partial<Pick<Post, CreatePostOptionalKeys>>;
