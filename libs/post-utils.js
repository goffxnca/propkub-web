import {
  collection,
  setDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  updateDoc,
  addDoc,
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
import { ACCEPT_POST_MSG } from "./constants";
import { adminMarkPostAsFulfilled } from "./managers/postActionManager";
import { apiClient } from "./client";
import { populateAddressLabels } from "./utils/address-utils";

const postsCollectionRef = collection(db, "posts");

const sanitizerOptions = {
  allowedTags: ["p", "strong", "em", "u", "ol", "ul", "li", "br"],
};

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

export const getAllPostsByUserId = async (userId) => {
  const q = query(
    postsCollectionRef,
    where("createdBy.userId", "==", userId),
    orderBy("createdAt", "desc")
    // limit(10)
  );

  const postsDocs = await getDocs(q);
  const posts = [];
  postsDocs.forEach((doc) => {
    posts.push({
      ...doc.data(),
      id: doc.id,
      createdAt: new Date(doc.data().createdAt.toMillis()).toLocaleDateString(),
      updatedAt: null,
      legal: null,
    });
  });
  return posts;
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

export const addNewPost = async (postData, user) => {
  const docRef = doc(postsCollectionRef);
  const docId = docRef.id;

  return Promise.all(
    postData.images.map((file) => uploadFileToStorage("po", docId, file))
  ).then(async (downloadUrls) => {
    if (downloadUrls.length !== postData.images.length) {
      throw new Error(
        `Failed creating post, only ${downloadUrls}/${postData.images.length} uploaded successfully`
      );
    }

    const sanitizerOptions = {
      allowedTags: ["p", "strong", "em", "u", "ol", "ul", "li", "br"],
    };

    const newPost = {
      // Required
      title: sanitizeHtml(postData.title, sanitizerOptions) || "",
      desc: sanitizeHtml(postData.desc_html) || "",
      assetType: postData.assetType || "",
      postType: postData.postType || "",
      price: postData.price || 0,
      isDraft: false,
      thumbnail: downloadUrls[0] || "",
      images: downloadUrls || [],
      facilities: getFacilityArray(postData.facilities) || [],
      specs: convertSpecToDbFormat(postData.specs) || [],
      address: postData.address || {},

      // Optional
      isStudio: postData.isStudio || false,
      video: sanitizeHtml(postData.video, sanitizerOptions) || "",
      land: postData.land || 0,
      landUnit: postData.landUnit || "",
      area: postData.area || 0,
      areaUnit: postData.areaUnit || "",
      priceUnit: postData.priceUnit || "",
      condition: postData.condition || "",
      refId: sanitizeHtml(postData.refId) || "",
    };

    console.log(newPost);

    //TODO: using firebase function for server validate data later
    return setDoc(docRef, newPost).then(() => {
      return { slug: newPost.slug };
    });
  });
};

export const addNewPost2 = async (postData) => {
  const staticImageUrls = [
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=800",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
  ];

  // Prepare data for new API
  const newPost = {
    // Required fields
    title: sanitizeHtml(postData.title, sanitizerOptions),
    desc: sanitizeHtml(postData.desc_html),
    assetType: postData.assetType,
    postType: postData.postType,
    price: postData.price,
    isDraft: false,
    thumbnail: staticImageUrls[0],
    images: staticImageUrls,
    facilities: getFacilityArray(postData.facilities),
    specs: convertSpecToDbFormat(postData.specs),
    address: populateAddressLabels(postData.address),

    // Optional fields
    // isStudio: postData.isStudio,
    // video: sanitizeHtml(postData.video, sanitizerOptions) || undefined,
    land: postData.land,
    landUnit: postData.landUnit,
    area: postData.area,
    areaUnit: postData.areaUnit,
    priceUnit: postData.priceUnit,
    // condition: postData.condition,
    // refId: sanitizeHtml(postData.refId, sanitizerOptions) || undefined,
  };

  console.log("Calling new API with data:", newPost);

  const result = await apiClient.posts.create(newPost);

  return {
    slug: result.slug,
    id: result._id || result.id,
  };
};

export const updatePost = async (postId, postData) => {
  const toBeUpdatedPost = {
    title: sanitizeHtml(postData.title, sanitizerOptions) || "",
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
