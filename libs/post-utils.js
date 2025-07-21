import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../libs/firebase";
import { getFacilityArray } from "./mappers/facilityMapper";
import { convertSpecToDbFormat } from "./mappers/specMapper";
import sanitizeHtml from "sanitize-html";
import { getUnixEpochTime } from "./date-utils";
import { uploadFileToStorage } from "./utils/file-utils";
import { SANITIZE_OPTIONS } from "./constants";
import { adminMarkPostAsFulfilled } from "./managers/postActionManager";
import { apiClient } from "./client";
import { populateAddressLabels } from "./utils/address-utils";

export const fetchActivePosts = async () => {
  const response = await apiClient.posts.getAllPosts(1, 50);
  const posts = response?.items || [];
  return posts;
};

export const getAllActivePostsForSitemap = async () => {
  // const q = query(
  //   postsCollectionRef,
  //   where("status", "==", "active"),
  //   orderBy("createdAt", "desc")
  // );

  // const postsDocs = await getDocs(q);
  // const posts = [];
  // postsDocs.forEach((doc) => {
  //   posts.push({
  //     ...doc.data(),
  //     id: doc.id,
  //     createdAt: new Date(doc.data().createdAt.toMillis()).toISOString(),
  //     updatedAt: null,
  //     legal: null,
  //   });
  // });
  return [];
};

export const getLatestActivePostForSitemap = async () => {
  // const q = query(
  //   postsCollectionRef,
  //   where("status", "==", "active"),
  //   orderBy("createdAt", "desc"),
  //   limit(1)
  // );

  // const querySnapshot = await getDocs(q);

  // if (querySnapshot.empty) {
  //   return null;
  // }

  // const doc = querySnapshot.docs[0];

  // const latestActivePost = {
  //   ...doc.data(),
  //   id: doc.id,
  //   createdAt: new Date(doc.data().createdAt.toMillis()).toISOString(),
  //   updatedAt: null,
  //   legal: null,
  // };

  return [];
};

export const getAllActivePostsByLocation = async ({
  assetType,
  postType,
  locationType,
  locationId,
}) => {
  console.log("getAllActivePostsByLocation");
  const conditions = {
    assetType: assetType,
    postType: postType,
  };

  if (locationType === "pv") {
    conditions.provinceId = locationId;
  } else if (locationType === "dt") {
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
  subDistrictId,
}) => {
  const posts = await apiClient.posts.searchPosts({
    postType,
    assetType,
    regionId,
    provinceId,
    districtId,
    subDistrictId,
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
      postData.images.map((file) => uploadFileToStorage("po", postNumber, file))
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

  // Prepare data for new API
  const newPost = {
    // Required fields
    postNumber: postNumber,
    title: postData.title,
    desc: postData.desc_html, // ReactQuill automatically escapes HTML input for "desc", backend will sanitize as additional security layer
    assetType: postData.assetType,
    postType: postData.postType,
    price: postData.price,
    thumbnail: downloadUrls[0],
    images: downloadUrls,
    facilities: getFacilityArray(postData.facilities),
    specs: convertSpecToDbFormat(postData.specs),
    address: populateAddressLabels(postData.address),

    // Optional fields
    isStudio: postData.isStudio,
    // video: postData.video || undefined,
    land: postData.land,
    landUnit: postData.landUnit,
    area: postData.area,
    areaUnit: postData.areaUnit,
    priceUnit: postData.priceUnit,
    condition: postData.condition,
    refId: postData.refId || undefined,
  };

  const result = await apiClient.posts.create(newPost);

  return result;
};

export const updatePost = async (postId, postData) => {
  const toBeUpdatedPost = {
    title: sanitizeHtml(postData.title, SANITIZE_OPTIONS) || "",
    assetType: postData.assetType || "",
    postType: postData.postType || "",
    condition: postData.condition || "",
    price: postData.price || 0,
    priceUnit: postData.priceUnit || "",
    area: postData.area || 0,
    areaUnit: postData.areaUnit || "",
    land: postData.land || 0,
    landUnit: postData.landUnit || "",
    isStudio: postData.isStudio || false,
    specs: convertSpecToDbFormat(postData.specs) || [],
    desc: sanitizeHtml(postData.desc_html) || "",
    facilities: getFacilityArray(postData.facilities) || [],
    refId: sanitizeHtml(postData.refId) || "",
    updatedAt: serverTimestamp(),
  };

  console.log(toBeUpdatedPost);

  //TODO: using firebase function for server validate data later
  const docRef = doc(db, "posts", postId);
  return updateDoc(docRef, toBeUpdatedPost);
};

//Once edit mode done, remove this (edit mode also have option to close the post)
export const deactivatePost = async (postId, user) => {
  return adminMarkPostAsFulfilled(postId);
};
