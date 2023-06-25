const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { REGION, SITE_DOMAIN } = require("../libs/constant");
const { addPostAction } = require("../libs/postActionFlow");
const { findDateDiff } = require("../libs/helpers/dateHelper");

const adminGetLatestTenPosts = functions
  .region(REGION)
  .https.onCall(async (data) => {
    try {
      const postsResult = await admin
        .firestore()
        .collection("/posts")
        .orderBy("createdAt", "desc")
        .limit(10)
        .get();

      const posts = [];
      postsResult.docs.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() });
      });
      return posts;
    } catch (error) {
      functions.logger.error(error.message, { input: data });
      throw error;
    }
  });

const adminGetPostsBySubStatus = functions
  .region(REGION)
  .https.onCall(async (data) => {
    const { subStatus } = data;
    try {
      if (!subStatus) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          `The provided arguments is invalid`
        );
      }
      const queryResult = await admin
        .firestore()
        .collection("/posts")
        .where("subStatus", "==", subStatus)
        .limit(10)
        .get();

      const posts = [];
      queryResult.docs.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() });
      });
      return posts;
    } catch (error) {
      functions.logger.error(error.message, { input: data });
      throw error;
    }
  });

const adminGetPostsWithRequestedIndexMoreThan3Days = functions
  .region(REGION)
  .https.onCall(async (data) => {
    try {
      const finalPosts = [];

      const postsQueryResult = await admin
        .firestore()
        .collection("/posts")
        .where("subStatus", "==", "requested_index")
        .limit(100)
        .get();

      for (const doc of postsQueryResult.docs) {
        const postData = { id: doc.id, ...doc.data() };
        const postActionQueryResult = await admin
          .firestore()
          .collection("/postActions")
          .where("postId", "==", postData.id)
          .orderBy("createdAt", "desc")
          .limit(10)
          .get();

        if (!postActionQueryResult.empty) {
          const latestPostActionDoc = postActionQueryResult.docs[0];
          if (latestPostActionDoc.exists) {
            const latestPostAction = {
              id: latestPostActionDoc.id,
              ...latestPostActionDoc.data(),
            };
            if (latestPostAction.actionName === "RequestIndex") {
              const now = new Date();
              const postActionCreatedAt = new Date(
                latestPostAction.createdAt._seconds * 1000
              );
              const dateDiffInDays = findDateDiff(postActionCreatedAt, now);
              functions.logger.info({
                dateDiffInDays: dateDiffInDays,
              });
              if (dateDiffInDays >= 2) {
                finalPosts.push(postData);
              }
            }
          }
        }
      }
      return finalPosts;
    } catch (error) {
      functions.logger.error(error.message, { input: data });
      throw error;
    }
  });

const adminGetPostById = functions.region(REGION).https.onCall(async (data) => {
  const { postId } = data;
  try {
    if (!postId) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        `Post id is required`
      );
    }

    const postDoc = await admin
      .firestore()
      .collection("/posts")
      .doc(postId)
      .get();

    if (!postDoc.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        `Post id:${postId} not found`
      );
    }
    return { id: postDoc.id, ...postDoc.data() };
  } catch (error) {
    functions.logger.error(error.message, { input: data });
    throw error;
  }
});

const adminMarkPostAsRequestedIndex = functions
  .region(REGION)
  .https.onCall(async (data) => {
    const { postId } = data;
    try {
      if (!postId) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          `Post id is required`
        );
      }

      const postDoc = await admin
        .firestore()
        .collection("/posts")
        .doc(postId)
        .get();

      if (!postDoc.exists) {
        throw new functions.https.HttpsError(
          "not-found",
          `Post id:${postId} not found`
        );
      }

      const post = { postId, ...postDoc.data() };
      const { slug, indexed } = post;

      if (indexed) {
        throw new functions.https.HttpsError(
          "already-exists",
          `Post id:${postId} is already indexed`
        );
      }

      await addPostAction({
        post: post,
        actionName: "RequestIndex",
        customEmailTemplateData: {
          postUrl: `${SITE_DOMAIN}/property/${slug}?a=email&t=requested_index`,
        },
        addPostActionByAdmin: true,
      });

      const message = `Post id:${postId} is reqested for indexing successfully`;
      functions.logger.info(message);

      return {
        status: "OK",
        message,
      };
    } catch (error) {
      functions.logger.error(error.message, { input: data });
      throw error;
    }
  });

const adminMarkPostAsIndexed = functions
  .region(REGION)
  .https.onCall(async (data) => {
    const { postId } = data;
    try {
      if (!postId) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          `Post id is required`
        );
      }

      const postDoc = await admin
        .firestore()
        .collection("/posts")
        .doc(postId)
        .get();

      if (!postDoc.exists) {
        throw new functions.https.HttpsError(
          "not-found",
          `Post id:${postId} not found`
        );
      }

      const post = { postId, ...postDoc.data() };
      const { slug, indexed } = post;

      if (indexed) {
        throw new functions.https.HttpsError(
          "already-exists",
          `Post id:${postId} is already indexed`
        );
      }

      await admin.firestore().collection("/posts").doc(postId).update({
        indexed: true,
      });

      await addPostAction({
        post: post,
        actionName: "MarkIndexed",
        customEmailTemplateData: {
          postUrl: `${SITE_DOMAIN}/property/${slug}?a=email&t=indexed`,
        },
        addPostActionByAdmin: true,
      });

      const message = `Post id:${postId} is marked as indexed successfully`;
      functions.logger.info(message);

      return {
        status: "OK",
        message,
      };
    } catch (error) {
      functions.logger.error(error.message, { input: data });
      throw error;
    }
  });

const adminMarkPostAsFulfilled = functions
  .region(REGION)
  .https.onCall(async (data) => {
    const { postId, actionByAdmin } = data;
    try {
      if (!postId) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          `The provided arguments is invalid`
        );
      }

      const postDoc = await admin
        .firestore()
        .collection("/posts")
        .doc(postId)
        .get();

      if (!postDoc.exists) {
        throw new functions.https.HttpsError(
          "not-found",
          `Post id:${postId} not found`
        );
      }

      const post = { postId, ...postDoc.data() };
      const { slug } = post;

      await addPostAction({
        post: post,
        actionName: "FulfillPost",
        customEmailTemplateData: {
          postUrl: `${SITE_DOMAIN}/property/${slug}?a=email&t=fulfilled`,
        },
        addPostActionByAdmin: actionByAdmin ?? true,
      });

      const message = `Post id:${postId} is marked as fulfilled successfully`;
      functions.logger.info(message);

      return {
        status: "OK",
        message,
      };
    } catch (error) {
      functions.logger.error(error.message, { input: data });
      throw error;
    }
  });

const adminMarkPostAsClosed = functions
  .region(REGION)
  .https.onCall(async (data) => {
    const { postId, reason } = data;
    try {
      if (!postId || !reason) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          `The provided arguments is invalid`
        );
      }

      const postDoc = await admin
        .firestore()
        .collection("/posts")
        .doc(postId)
        .get();

      if (!postDoc.exists) {
        throw new functions.https.HttpsError(
          "not-found",
          `Post id:${postId} not found`
        );
      }

      const post = { postId, ...postDoc.data() };
      const { slug } = post;

      await addPostAction({
        post: post,
        actionName: "ClosePost",
        customEmailTemplateData: {
          postUrl: `${SITE_DOMAIN}/property/${slug}?a=email&t=closed`,
          note: reason.label ? "เนื่องจาก" + reason.label : "",
        },
        addPostActionByAdmin: true,
        actionNote: reason.label || "",
        additional: { reason },
      });

      const message = `Post id:${postId} is marked as closed successfully`;
      functions.logger.info(message);

      return {
        status: "OK",
        message,
      };
    } catch (error) {
      functions.logger.error(error.message, { input: data });
      throw error;
    }
  });

module.exports = {
  adminGetPostById,
  adminGetLatestTenPosts,
  adminGetPostsBySubStatus,
  adminMarkPostAsRequestedIndex,
  adminGetPostsWithRequestedIndexMoreThan3Days,
  adminMarkPostAsIndexed,
  adminMarkPostAsFulfilled,
  adminMarkPostAsClosed,
};
