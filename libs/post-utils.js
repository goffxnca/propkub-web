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

import posts from "../data/posts.json";
import { db } from "../libs/firebase";
// import { getAddressWithLabels } from "./mappers/addressMapper";
import { getFacilityArray } from "./mappers/facilityMapper";
import { convertSpecToDbFormat } from "./mappers/specMapper";
import { genPostId, genSlug } from "./string-utils";
import sanitizeHtml from "sanitize-html";
import { getUnixEpochTime } from "./date-utils";
import { uploadFileToStorage } from "./utils/file-utils";
import { ACCEPT_POST_MSG } from "./constants";
import { adminMarkPostAsFulfilled } from "./managers/postActionManager";

const postsCollectionRef = collection(db, "posts");

export const seedPosts = async () => {
  posts.forEach(async (post) => {
    const randomId = Date.now().toString();
    const result = await setDoc(doc(postsCollectionRef, randomId), {
      ...post,
      slug: post.slug + "_" + randomId,
    });
    console.log(result);
  });
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
  debugger;
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

    const customContactInfo = postData.contactInfo
      ? {
          name: postData.contactInfo.name || "",
          phone: postData.contactInfo.phone || "",
          line: postData.contactInfo.line || "",
          profileImg: process.env.NEXT_PUBLIC_AGENT_DEFAULT_IMAGE || "",
          passcode: postData.contactInfo.passcode || "",
        }
      : null;

    debugger;

    // const response = await fetch("https://geolocation-db.com/json/");
    // const data = await response.json();
    const uInfo = {
      // ip: data.IPv4,
      // city: data.city,
      // lat: data.latitude,
      // lng: data.longitude,
      // ...data,
      ua: navigator?.userAgent || "N/A",
    };

    // const postNumber = await genPostId();

    const acceptInfo = {
      accept: postData.accept,
      acceptTerm: ACCEPT_POST_MSG,
      allowShare: false,
    };

    const newPost = {
      postType: postData.postType || "",
      assetType: postData.assetType || "",
      condition: postData.condition || "",
      title: sanitizeHtml(postData.title, sanitizerOptions) || "",
      slug:
        genSlug(sanitizeHtml(postData.title, sanitizerOptions)).substring(
          0,
          70
        ) +
        "_" +
        docId,
      desc: sanitizeHtml(postData.desc_html) || "",
      thumbnail: downloadUrls[0] || "",
      images: downloadUrls || [],
      video: sanitizeHtml(postData.video, sanitizerOptions) || "",
      price: postData.price || 0,
      priceUnit: postData.priceUnit || "",
      area: postData.area || 0,
      areaUnit: postData.areaUnit || "",
      land: postData.land || 0,
      landUnit: postData.landUnit || "",
      address: postData.address || {},
      isStudio: postData.isStudio || false,
      specs: convertSpecToDbFormat(postData.specs) || [],
      facilities: getFacilityArray(postData.facilities) || [],
      refId: sanitizeHtml(postData.refId) || "",
      status: "active",
      postNumber: getUnixEpochTime(),
      indexed: false,
      createdAt: serverTimestamp(),
      createdBy: {
        userId: user?.userId || "",
        email: user?.email || "",
        role: user?.role || "",
        name: user?.displayName || "",
        phone: user?.phone?.replace("+66", "0") || "",
        profileImg: user?.photoURL || "",
        line: user?.line || "",
      },
      isMember: !!user,
      legal: { uInfo, acceptInfo },
    };

    debugger;
    if (customContactInfo) {
      newPost.contact = customContactInfo;
    }

    console.log(newPost);

    //TODO: using firebase function for server validate data later
    return setDoc(docRef, newPost).then(() => {
      return { slug: newPost.slug };
    });
  });
};

export const updatePost = async (postId, postData, user) => {
  const sanitizerOptions = {
    allowedTags: ["p", "strong", "em", "u", "ol", "ul", "li", "br"],
  };

  const customContactInfo = postData.contactInfo
    ? {
        name: postData.contactInfo.name || "",
        phone: postData.contactInfo.phone || "",
        line: postData.contactInfo.line || "",
        passcode: postData.contactInfo.passcode || "",
        profileImg: process.env.NEXT_PUBLIC_AGENT_DEFAULT_IMAGE || "",
      }
    : null;

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
    updatedBy: {
      userId: user?.userId || "",
      email: user?.email || "",
      role: user?.role || "",
      name: user?.displayName || "",
      phone: user?.phone?.replace("+66", "0") || "",
      profileImg: user?.photoURL || "",
      line: user?.line || "",
    },
  };

  debugger;
  if (customContactInfo) {
    toBeUpdatedPost.contact = customContactInfo;
  }

  console.log(toBeUpdatedPost);

  //TODO: using firebase function for server validate data later
  const docRef = doc(db, "posts", postId);
  return updateDoc(docRef, toBeUpdatedPost);
};

export const deactivatePost = async (postId, user) => {
  return adminMarkPostAsFulfilled(postId);
};

// export const tempUpdateCID = async () => {
//   const q = query(
//     postsCollectionRef,
//     orderBy("createdAt", "asc")
//     // limit(10)
//   );

//   const allPostDocs = await getDocs(q);
//   const posts = [];
//   let counter = 0;
//   allPostDocs.forEach((docu) => {
//     const postId = docu.id;
//     const updateData = async () => {
//       console.log(postId, counter);

//       const toBeUpdatedPost = {
//         cid: counter,
//       };

//       //TODO: using firebase function for server validate data later
//       const docRef = doc(db, "posts", postId);
//       await updateDoc(docRef, toBeUpdatedPost);
//     };
//     counter++;
//     return updateData();
//   });
//   return posts;
// };
// trigger
