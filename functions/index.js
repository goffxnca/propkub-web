const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");
const { sendEmail } = require("./libs/mail");
const {
  EMAIL_WELCOME,
  SITE_DOMAIN,
  NO_REPLY_EMAIL,
  REGION,
  EMAIL_CONFIRM_OLD_USERS,
} = require("./libs/constant");

const {
  adminGetLatestTenPosts,
  adminGetPostsBySubStatus,
  adminGetPostById,
  adminMarkPostAsIndexed,
  adminMarkPostAsRequestedIndex,
  adminGetPostsWithRequestedIndexMoreThan3Days,
  adminMarkPostAsFulfilled,
  adminMarkPostAsClosed,
} = require("./admin/admin");

const { getNotifications } = require("./managers/notification");
const { getPostActions } = require("./repositories/postActionRepository");
const { readNotification } = require("./services/notificationService");

const { addLog } = require("./log");
const { addPostAction } = require("./libs/postActionFlow");
const { randomInteger } = require("./libs/helpers/numberHelper");

admin.initializeApp();

// BACKGROUNDS

// on update user profile, sync Fire Store to Firebase Auth
exports.onUsersDocUpdated = functions
  .region(REGION)
  .firestore.document("users/{userId}")
  .onUpdate((change, context) => {
    const { userId } = context.params;

    const {
      name: prevName,
      line: prevLine,
      profileImg: prevProfileImg,
      phone: prevPhone,
    } = change.before.data();
    const { name, line, profileImg, phone } = change.after.data();

    const isCoreProfileDataChanged =
      name !== prevName ||
      line !== prevLine ||
      profileImg !== prevProfileImg ||
      phone !== prevPhone;

    if (!isCoreProfileDataChanged) {
      functions.logger.info("exit, no core profile data changed");
      return "";
    }

    const updateFireStoreAuthUser = async () => {
      try {
        await admin.auth().updateUser(userId, {
          displayName: name,
          photoURL: profileImg,
          phoneNumber: "+66" + phone.substring(1),
        });

        const currentFirebaseAuthUser = await admin.auth().getUser(userId);
        await admin.auth().setCustomUserClaims(userId, {
          ...currentFirebaseAuthUser.customClaims,
          line: line,
        });

        const successMessage = `Update firestore auth successfully`;
        functions.logger.info(successMessage);
        return successMessage;
      } catch (error) {
        functions.logger.error(error.message, {
          input: {
            userId,
            name: name,
            line,
            profileImg,
            phone,
          },
        });
        throw error;
      }
    };
    return updateFireStoreAuthUser();
  });

exports.onPostsDocCreated = functions
  .region(REGION)
  .firestore.document("posts/{postId}")
  .onCreate((snap, context) => {
    const { postId } = context.params;

    const post = { postId, ...snap.data() };
    const { slug } = post;

    const asyncTasks = async () => {
      try {
        await addPostAction({
          post: post,
          actionName: "CreatePost",
          customEmailTemplateData: {
            postUrl: `${SITE_DOMAIN}/property/${slug}?a=email&t=created`,
          },
          addPostActionByAdmin: false,
        });

        //Update Post Counter
        await admin
          .firestore()
          .collection("/counters")
          .doc("postCounter")
          .update({
            counter: admin.firestore.FieldValue.increment(1),
            refId: postId,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });

        const postCounterDoc = await admin
          .firestore()
          .collection("/counters")
          .doc("postCounter")
          .get();

        await admin
          .firestore()
          .collection("/posts")
          .doc(postId)
          .update({
            cid: postCounterDoc.data().counter || -1,
          });

        const successMessage = `Ran 'onPostsDocCreated' functions successfully`;
        functions.logger.info(successMessage);
        return successMessage;
      } catch (error) {
        functions.logger.error(error.message, {
          input: snap.data(),
        });
        throw error;
      }
    };

    return asyncTasks();
  });

// ON-CALLS
// after new user registered, sync Firebase Auth to Fire Store
exports.postUserSignup = functions.region(REGION).https.onCall(async (data) => {
  try {
    const { uid, email, name, role } = data;
    const allowedRoles = ["agent", "normal"];

    if (!allowedRoles.includes(role)) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        `'${role}' is invalid role`
      );
    }

    await admin.auth().updateUser(uid, { displayName: name });

    await admin.auth().setCustomUserClaims(uid, {
      role: role,
      line: "",
    });

    const emailVerficationToken = uuidv4();
    await admin
      .firestore()
      .collection("/users")
      .doc(uid)
      .set({
        email,
        name,
        role,
        profileImg: "",
        phone: "",
        line: "",
        emailVerified: false,
        emailVToken: emailVerficationToken,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        createdBy: { name: "admin_sdk" },
      });

    const verificationUrl = `${SITE_DOMAIN}/auth/verify-email?vtoken=${emailVerficationToken}&email=${encodeURIComponent(
      email
    )}`;
    await sendEmail({
      from: NO_REPLY_EMAIL,
      to: email,
      templateId: EMAIL_WELCOME,
      templateData: {
        verificationUrl,
      },
    });

    const successMessage = `user:${email} have been assigned role successfully`;
    functions.logger.info(successMessage);

    return successMessage;
  } catch (error) {
    functions.logger.error(error.message, { input: { ...data } });
    throw error;
  }
});

exports.verifyEmail = functions.region(REGION).https.onCall(async (data) => {
  try {
    const { email, vToken } = data;
    if (!email) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        `Email is required`
      );
    }

    if (!vToken) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        `Verification token is required`
      );
    }

    const userQueryResult = await admin
      .firestore()
      .collection("/users")
      .where("email", "==", email)
      .where("emailVToken", "==", vToken)
      .where("emailVerified", "==", false)
      .get();

    if (userQueryResult.empty) {
      throw new functions.https.HttpsError(
        "not-found",
        `Email or verification token is not correct`
      );
    }

    const firstResult = userQueryResult.docs[0];
    const targetUserId = firstResult.id;

    await admin.firestore().collection("/users").doc(targetUserId).update({
      emailVerified: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await admin.auth().updateUser(targetUserId, { emailVerified: true });

    const successMessage = `Email:'${email}' has been verified successfully`;
    functions.logger.info(successMessage);

    return { status: "OK", message: successMessage };
  } catch (error) {
    functions.logger.error(error.message, { input: { ...data } });
    throw error;
  }
});

exports.getPostView = functions.region(REGION).https.onCall(async (postId) => {
  try {
    if (!postId) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        `postId '${postId}' is invalid`
      );
    }

    const post = await admin.firestore().collection("/posts").doc(postId).get();
    functions.logger.info(post);

    return post?.data().postViews || 0;
  } catch (error) {
    functions.logger.error(error.message, { input: { postId } });
    throw error;
  }
});

exports.increasePostView = functions
  .region(REGION)
  .https.onCall(async (postId) => {
    try {
      if (!postId) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          `postId '${postId}' is invalid`
        );
      }

      await admin
        .firestore()
        .collection("/posts")
        .doc(postId)
        .update({
          postViews: admin.firestore.FieldValue.increment(1),
        });

      const successMessage = `Increase post's view of ${postId} by 1 successfully`;
      functions.logger.info(successMessage);

      return successMessage;
    } catch (error) {
      functions.logger.error(error.message, { input: { postId } });
      throw error;
    }
  });

exports.increasePhoneView = functions
  .region(REGION)
  .https.onCall(async (postId) => {
    try {
      if (!postId) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          `postId '${postId}' is invalid`
        );
      }

      await admin
        .firestore()
        .collection("/posts")
        .doc(postId)
        .update({
          phoneViews: admin.firestore.FieldValue.increment(1),
        });

      const successMessage = `Increase phone view of ${postId} by 1 successfully`;
      functions.logger.info(successMessage);

      return successMessage;
    } catch (error) {
      functions.logger.error(error.message, { input: { postId } });
      throw error;
    }
  });

exports.increaseLineView = functions
  .region(REGION)
  .https.onCall(async (postId) => {
    try {
      if (!postId) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          `postId '${postId}' is invalid`
        );
      }

      await admin
        .firestore()
        .collection("/posts")
        .doc(postId)
        .update({
          lineViews: admin.firestore.FieldValue.increment(1),
        });

      const successMessage = `Increase line view of ${postId} by 1 successfully`;
      functions.logger.info(successMessage);

      return successMessage;
    } catch (error) {
      functions.logger.error(error.message, { input: { postId } });
      throw error;
    }
  });

exports.cronRIPVTier1 = functions
  .region(REGION)
  .pubsub.schedule("every 5 mins from 06:00 to 22:50")
  .timeZone("Asia/Bangkok")
  .onRun(async (context) => {
    //query latest post counter used as boundary of random number
    const postCounterDoc = await admin
      .firestore()
      .collection("/counters")
      .doc("postCounter")
      .get();

    const latestPostCounter = postCounterDoc.data().counter;
    // const randomCID = Math.floor(Math.random() * latestPostCounter) + 1;

    const randomFrom = latestPostCounter - 30;
    const randomCID = randomInteger(randomFrom, latestPostCounter);

    //query a target post by cid and grab it's post id to start updating that postview
    const cidQueryResult = await admin
      .firestore()
      .collection("/posts")
      .where("cid", "==", randomCID)
      .get();

    const firstResult = cidQueryResult.docs[0];
    const targetPostId = firstResult.id;
    const targetPostData = firstResult.data();

    const createdByEmail = targetPostData.createdBy?.email;

    //random increment between 1-6 to make it even more dynamic
    // const increment =
    //   createdByEmail && createdByEmail === "nimrt2528@gmail.com"
    //     ? 1
    //     : Math.floor(Math.random() * 6) + 1;

    const increment = randomInteger(3, 10);

    //increase the post view of target randomed post
    await admin
      .firestore()
      .collection("/posts")
      .doc(targetPostId)
      .update({
        postViews: admin.firestore.FieldValue.increment(increment),
      });

    functions.logger.info("Increase post view by cronRIPV successfully", {
      latestPostCounter,
      randomCID,
      targetPostId,
      prePostViews: targetPostData.postViews,
      increment,
    });
    return null;
  });

exports.cronRIPVTier2 = functions
  .region(REGION)
  .pubsub.schedule("every 5 mins from 06:00 to 22:50")
  .timeZone("Asia/Bangkok")
  .onRun(async (context) => {
    //query latest post counter used as boundary of random number
    const postCounterDoc = await admin
      .firestore()
      .collection("/counters")
      .doc("postCounter")
      .get();

    const latestPostCounter = postCounterDoc.data().counter;
    // const randomCID = Math.floor(Math.random() * latestPostCounter) + 1;

    const randomTo = latestPostCounter - 30;
    const randomCID = randomInteger(1, randomTo - 1);

    //query a target post by cid and grab it's post id to start updating that postview
    const cidQueryResult = await admin
      .firestore()
      .collection("/posts")
      .where("cid", "==", randomCID)
      .get();

    const firstResult = cidQueryResult.docs[0];
    const targetPostId = firstResult.id;
    const targetPostData = firstResult.data();

    const createdByEmail = targetPostData.createdBy?.email;

    //random increment between 1-6 to make it even more dynamic
    // const increment =
    //   createdByEmail && createdByEmail === "nimrt2528@gmail.com"
    //     ? 1
    //     : Math.floor(Math.random() * 6) + 1;

    const increment = randomInteger(1, 6);

    //increase the post view of target randomed post
    await admin
      .firestore()
      .collection("/posts")
      .doc(targetPostId)
      .update({
        postViews: admin.firestore.FieldValue.increment(increment),
      });

    functions.logger.info("Increase post view by cronRIPV successfully", {
      latestPostCounter,
      randomCID,
      targetPostId,
      prePostViews: targetPostData.postViews,
      increment,
    });
    return null;
  });

exports.tempSendConfirmEmail = functions
  .region(REGION)
  .https.onCall(async (data) => {
    const { email } = data;
    try {
      if (!email) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          `User email required`
        );
      }

      const userQueryResult = await admin
        .firestore()
        .collection("/users")
        .where("email", "==", email)
        .get();

      const firstResult = userQueryResult.docs[0];
      if (firstResult) {
        const targetUserId = firstResult.id;
        const targetUserData = firstResult.data();
        const emailVerficationToken = uuidv4();

        await admin.firestore().collection("/users").doc(targetUserId).update({
          emailVToken: emailVerficationToken,
          emailVerified: false,
        });

        const verificationUrl = `${SITE_DOMAIN}/auth/verify-email?vtoken=${emailVerficationToken}&email=${encodeURIComponent(
          email
        )}`;
        await sendEmail({
          from: NO_REPLY_EMAIL,
          to: email,
          templateId: EMAIL_CONFIRM_OLD_USERS,
          templateData: {
            verificationUrl,
            name: targetUserData.name,
          },
        });

        return { message: "send email success", targetUserId, targetUserData };
      } else {
        return "not found user" + email;
      }
    } catch (error) {
      functions.logger.error(error.message, { input: { email } });
      throw error;
    }
  });

//admins
exports.adminGetLatestTenPosts = adminGetLatestTenPosts;
exports.adminGetPostsBySubStatus = adminGetPostsBySubStatus;
exports.adminGetPostById = adminGetPostById;
exports.adminMarkPostAsIndexed = adminMarkPostAsIndexed;
exports.adminMarkPostAsRequestedIndex = adminMarkPostAsRequestedIndex;
exports.adminGetPostsWithRequestedIndexMoreThan3Days =
  adminGetPostsWithRequestedIndexMoreThan3Days;
exports.adminMarkPostAsFulfilled = adminMarkPostAsFulfilled;
exports.adminMarkPostAsClosed = adminMarkPostAsClosed;

//logs
exports.addLog = addLog;

//notifications
exports.getNotifications = getNotifications;
exports.readNotification = readNotification;

//post actions
exports.getPostActions = getPostActions;
