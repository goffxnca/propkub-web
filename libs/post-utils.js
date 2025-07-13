import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  updateDoc,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
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

const postsCollectionRef = collection(db, "posts");

export const getAllActivePosts = async (records = 0) => {
  const q = query(
    postsCollectionRef,
    where("status", "==", "active"),
    orderBy("createdAt", "desc"),
    limit(records || 50)
  );

  const postsDocs = await getDocs(q);
  const posts = [];
  postsDocs.forEach((doc) => {
    posts.push({
      ...doc.data(),
      id: doc.id,
      createdAt: new Date(doc.data().createdAt.toMillis()).toISOString(),
      updatedAt: null,
      legal: null,
    });
  });
  return posts;
};

export const getAllActivePostsForSitemap = async () => {
  const q = query(
    postsCollectionRef,
    where("status", "==", "active"),
    orderBy("createdAt", "desc")
  );

  const postsDocs = await getDocs(q);
  const posts = [];
  postsDocs.forEach((doc) => {
    posts.push({
      ...doc.data(),
      id: doc.id,
      createdAt: new Date(doc.data().createdAt.toMillis()).toISOString(),
      updatedAt: null,
      legal: null,
    });
  });
  return posts;
};

export const getLatestActivePostForSitemap = async () => {
  const q = query(
    postsCollectionRef,
    where("status", "==", "active"),
    orderBy("createdAt", "desc"),
    limit(1)
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const doc = querySnapshot.docs[0];

  const latestActivePost = {
    ...doc.data(),
    id: doc.id,
    createdAt: new Date(doc.data().createdAt.toMillis()).toISOString(),
    updatedAt: null,
    legal: null,
  };

  return latestActivePost;
};

export const getAllActivePostsByLocation = async (
  assetType,
  locationType,
  locationId,
  records = 0
) => {
  console.log("SSS", locationId);
  const q = query(
    postsCollectionRef,
    where(
      `address.${
        locationType === "pv"
          ? "provinceId"
          : locationType === "dt"
          ? "districtId"
          : "subDistrictId"
      }`,
      "==",
      locationId
    ),
    where("assetType", "==", assetType),
    where("status", "==", "active"),
    orderBy("createdAt", "desc"),
    limit(records || 50)
  );

  const postsDocs = await getDocs(q);
  const posts = [];
  postsDocs.forEach((doc) => {
    posts.push({
      ...doc.data(),
      id: doc.id,
      createdAt: new Date(doc.data().createdAt.toMillis()).toISOString(),
      updatedAt: null,
      legal: null,
    });
  });
  return posts;
};

export const getSixSimilarPosts = async ({ assetType, postType }) => {
  const q = query(
    postsCollectionRef,
    where("assetType", "==", assetType),
    where("postType", "==", postType),
    where("status", "==", "active"),
    orderBy("createdAt", "desc"),
    limit(21) //we will exclude the origin post from here from js later so get 7 as query too complex
  );

  const postDocs = await getDocs(q);
  const posts = [];
  postDocs.forEach((doc) => {
    posts.push({
      ...doc.data(),
      id: doc.id,
      createdAt: new Date(doc.data().createdAt.toMillis()).toISOString(),
      updatedAt: null,
      legal: null,
    });
  });
  return posts;
};

export const getAllPublicPosts = async (records = 0) => {
  const q = query(
    postsCollectionRef,
    orderBy("createdAt", "desc"),
    limit(records || 10000)
  );

  const postsDocs = await getDocs(q);
  const posts = [];
  postsDocs.forEach((doc) => {
    posts.push({
      ...doc.data(),
      id: doc.id,
      createdAt: new Date(doc.data().createdAt.toMillis()).toISOString(),
      updatedAt: null,
      legal: null,
    });
  });
  return posts;
};

export const getMyPosts = async (page = 1, per_page = 10) => {
  const response = await apiClient.posts.getMyPosts(page, per_page);
  return response;
};

export const countAllPosts = async () => {
  const q = query(postsCollectionRef);
  const postsDocs = await getDocs(q);
  return postsDocs.size;
};

export const queryPostWithFilters = async ({
  postType,
  assetType,
  regionId,
  provinceId,
  districtId,
  subDistrictId,
  minPrice,
  maxPrice,
  condition,
  keyword,
}) => {
  const conditions = [];

  console.log("regionId", regionId);
  if (postType) {
    conditions.push(where("postType", "==", postType.searchFor));
  }

  if (assetType) {
    conditions.push(where("assetType", "==", assetType));
  }

  if (condition) {
    conditions.push(where("condition", "==", condition));
  }

  if (subDistrictId) {
    conditions.push(where("address.subDistrictId", "==", subDistrictId));
  } else if (districtId) {
    conditions.push(where("address.districtId", "==", districtId));
  } else if (provinceId) {
    conditions.push(where("address.provinceId", "==", provinceId));
  } else if (regionId) {
    conditions.push(where("address.regionId", "==", regionId));
  }

  if (minPrice) {
    conditions.push(where("price", ">=", minPrice));
  }

  if (maxPrice) {
    conditions.push(where("price", "<=", maxPrice));
  }

  //This logic is zuck i know, but firestore dont allow to order by createdAt field if we have minPrice or maxPrice
  if (!minPrice && !maxPrice) {
    conditions.push(orderBy("createdAt", "desc"));
  }

  conditions.push(limit(20)); //TODO: Change to something better when pagination implemented

  const q = query(postsCollectionRef, ...conditions);

  const posts = [];

  if (keyword) {
  } else {
    const postsDocs = await getDocs(q);
    postsDocs.forEach((doc) => {
      posts.push({
        ...doc.data(),
        id: doc.id,
        createdAt: new Date(
          doc.data().createdAt.toMillis()
        ).toLocaleDateString(),
        legal: null,
      });
    });
  }

  return posts;
};

// export const getPostById = async (postId) => {
//   const query = query(postsColRef, where("id", "==", postId));
//   const docSnap = await getDoc(docRef);
//   return docSnap.data();
// };

export const getPostById = async (postId) => {
  const docRef = doc(postsCollectionRef, postId);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();

  return data
    ? {
        id: docSnap.id,
        ...data,
        createdAt: new Date(data.createdAt.toMillis()).toLocaleDateString(
          "th-TH"
        ),
        updatedAt: data.updatedAt
          ? new Date(data.updatedAt.toMillis()).toLocaleDateString("th-TH")
          : null,
        legal: null,
      }
    : null;
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
    isDraft: false,
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

export const deactivatePost = async (postId, user) => {
  return adminMarkPostAsFulfilled(postId);
};
