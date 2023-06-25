const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { REGION } = require("../libs/constant");

const getPostActions = functions.region(REGION).https.onCall(async (data) => {
  const { postId } = data;
  try {
    if (!postId) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        `The provided arguments is invalid`
      );
    }

    const postActionsQueryResult = await admin
      .firestore()
      .collection("/postActions")
      .where("postId", "==", postId)
      .orderBy("createdAt", "desc")
      .get();

    const postActions = [];
    postActionsQueryResult.docs.forEach((doc) => {
      postActions.push({
        id: doc.id,
        ...doc.data(),
        createdAtISO: new Date(
          doc.data().createdAt._seconds * 1000
        ).toISOString(),
      });
    });
    return postActions;
  } catch (error) {
    functions.logger.error(error.message, { input: data });
    throw error;
  }
});

module.exports = {
  getPostActions,
};
