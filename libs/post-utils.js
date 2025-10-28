import { getFacilityArray } from './mappers/facilityMapper';
import { getSpecsArray } from './mappers/specMapper';
import { getUnixEpochTime } from './date-utils';
import { uploadFileToStorage } from './utils/file-utils';
import { apiClient } from './client';
import { populateAddressLabels } from './utils/address-utils';

export const fetchActivePosts = async () => {
  const response = await apiClient.posts.getAllPosts({ page: 1, per_page: 50 });
  return response.items;
};

export const getAllActivePostsForSitemap = async () => {
  const response = await apiClient.posts.getAllActiveForSitemap();
  return response;
};

export const getLatestActivePostForSitemap = async () => {
  const response = await apiClient.posts.getLatestActiveForSitemap();
  return response;
};

export const getAllActivePostsByLocation = async ({
  assetType,
  postType,
  locationType,
  locationId
}) => {
  const conditions = {
    assetType: assetType,
    postType: postType
  };

  if (locationType === 'pv') {
    conditions.provinceId = locationId;
  } else if (locationType === 'dt') {
    conditions.districtId = locationId;
  } else {
    conditions.subDistrictId = locationId;
  }

  const posts = await apiClient.posts.searchPosts(conditions);
  return posts;
};

export const getMyPosts = async (page = 1, per_page = 20) => {
  const response = await apiClient.posts.getMyPosts(page, per_page);
  return response;
};

export const getMyPostsStats = async () => {
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
}) => {
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

export const FetchPostByNumber = async (postNumber) => {
  const response = await apiClient.posts.getByNumber(postNumber);
  return response;
};

export const FetchSimilarPosts = async (postId) => {
  const response = await apiClient.posts.getSimilarPosts(postId);
  return response;
};

export const addNewPost = async (postData) => {
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
  const newPost = {
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
    address: populateAddressLabels(postData.address),

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

export const updatePost = async (postId, postData) => {
  // During edit mode, only visible&dirtied&edited fields will be passed as postData

  // Only facilities&specs need re-formatting if they are edited
  if (postData.facilities) {
    postData.facilities = getFacilityArray(postData.facilities);
  }
  if (postData.specs) {
    postData.specs = getSpecsArray(postData.specs);
  }

  const result = await apiClient.posts.update(postId, postData);
  return result;
};
