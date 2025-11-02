import { getFacilityArray } from './mappers/facilityMapper';
import { getSpecsArray } from './mappers/specMapper';
import { getUnixEpochTime } from './date-utils';
import { uploadFileToStorage } from './utils/file-utils';
import { apiClient } from './client';
import { populateAddressLabels } from './utils/address-utils';
import type {
  Post,
  Address,
  AreaUnit,
  PriceUnit,
  Condition
} from '../types/models/post';
import type { SearchPostRequest } from '../types/dtos/requests/searchPostRequest';
import type { CreatePostRequest } from '../types/dtos/requests/createPostRequest';
import type { UpdatePostRequest } from '../types/dtos/requests/updatePostRequest';
import type { PostSitemapResponse } from '../types/dtos/responses/postSitemapResponse';
import type { PostStatsResponse } from '../types/dtos/responses/postStatsResponse';
import type { paginatedItemsResponse } from '../types/dtos/responses/paginatedItemsResponse';
import type { AssetType, PostType } from '../types/models/post';

export const fetchActivePosts = async (): Promise<Post[]> => {
  const response = await apiClient.posts.getAllPosts({ page: 1, per_page: 50 });
  return response.items;
};

export const getAllActivePostsForSitemap = async (): Promise<
  PostSitemapResponse[]
> => {
  const response = await apiClient.posts.getAllActiveForSitemap();
  return response;
};

export const getLatestActivePostForSitemap =
  async (): Promise<PostSitemapResponse> => {
    const response = await apiClient.posts.getLatestActiveForSitemap();
    return response;
  };

interface GetAllActivePostsByLocationParams {
  assetType: AssetType;
  postType: PostType;
  locationType: 'pv' | 'dt' | 'sd';
  locationId: string;
}

export const getAllActivePostsByLocation = async ({
  assetType,
  postType,
  locationType,
  locationId
}: GetAllActivePostsByLocationParams): Promise<Post[]> => {
  const conditions: Partial<SearchPostRequest> = {
    assetType: assetType,
    postType: postType,
    regionId: ''
  };

  if (locationType === 'pv') {
    conditions.provinceId = locationId;
  } else if (locationType === 'dt') {
    conditions.districtId = locationId;
  } else {
    conditions.subDistrictId = locationId;
  }

  const posts = await apiClient.posts.searchPosts(
    conditions as SearchPostRequest
  );
  return posts;
};

export const getMyPosts = async (
  page: number = 1,
  per_page: number = 20
): Promise<paginatedItemsResponse<Post>> => {
  const response = await apiClient.posts.getMyPosts({ page, per_page });
  return response;
};

export const getMyPostsStats = async (): Promise<PostStatsResponse> => {
  const response = await apiClient.posts.getMyPostsStats();
  return response;
};

export const queryPostWithFilters = async ({
  postType,
  assetType,
  regionId,
  provinceId,
  districtId,
  subDistrictId
}: SearchPostRequest): Promise<Post[]> => {
  const posts = await apiClient.posts.searchPosts({
    postType,
    assetType,
    regionId,
    provinceId,
    districtId,
    subDistrictId
  });
  return posts;
};

export const FetchPostByNumber = async (postNumber: string): Promise<Post> => {
  const response = await apiClient.posts.getByNumber(postNumber);
  return response;
};

export const FetchSimilarPosts = async (postId: string): Promise<Post[]> => {
  const response = await apiClient.posts.getSimilarPosts(postId);
  return response;
};

interface AddNewPostData {
  title: string;
  desc: string;
  assetType: AssetType;
  postType: PostType;
  price: number;
  images: File[];
  facilities: Record<string, boolean>;
  specs: Record<string, number>;
  address: any;
  isStudio?: boolean;
  land?: number;
  landUnit?: AreaUnit;
  area?: number;
  areaUnit?: AreaUnit;
  priceUnit?: PriceUnit;
  condition?: Condition;
  refId?: string;
}

export const addNewPost = async (postData: AddNewPostData): Promise<Post> => {
  let downloadUrls;
  const postNumber = getUnixEpochTime();

  try {
    downloadUrls = await Promise.all(
      postData.images.map((file) => uploadFileToStorage('po', postNumber, file))
    );

    if (downloadUrls.length !== postData.images.length) {
      throw new Error(
        `Failed uploading images, only ${downloadUrls.length}/${postData.images.length} uploaded successfully`
      );
    }
  } catch (error) {
    console.error(
      `Firebase Storage upload failed for postNumber: ${postNumber}`,
      error
    );
    throw error;
  }

  // Prepare data for new API 19 fields
  const newPost: CreatePostRequest = {
    // Required 11 fields
    postNumber: postNumber,
    title: postData.title,
    desc: postData.desc,
    assetType: postData.assetType,
    postType: postData.postType,
    price: postData.price,
    thumbnail: downloadUrls[0],
    images: downloadUrls,
    facilities: getFacilityArray(postData.facilities),
    specs: getSpecsArray(postData.specs),
    address: populateAddressLabels(postData.address) as Address,

    // Optional 8 fields
    isStudio: postData.isStudio,
    // video: postData.video || undefined,
    land: postData.land,
    landUnit: postData.landUnit,
    area: postData.area,
    areaUnit: postData.areaUnit,
    priceUnit: postData.priceUnit,
    condition: postData.condition,
    refId: postData.refId || undefined
  };

  const result = await apiClient.posts.create(newPost);

  return result;
};

export const updatePost = async (
  postId: string,
  postData: UpdatePostRequest
): Promise<Post> => {
  // During edit mode, only visible&dirtied&edited fields will be passed as postData

  // Only facilities&specs need re-formatting if they are edited
  if (postData.facilities && !Array.isArray(postData.facilities)) {
    postData.facilities = getFacilityArray(
      postData.facilities as Record<string, boolean>
    ) as any;
  }
  if (postData.specs && !Array.isArray(postData.specs)) {
    postData.specs = getSpecsArray(
      postData.specs as Record<string, number>
    ) as any;
  }

  const result = await apiClient.posts.update(postId, postData);
  return result;
};
