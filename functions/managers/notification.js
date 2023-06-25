const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { REGION } = require("../libs/constant");

const getNotifications = functions.region(REGION).https.onCall(async (data) => {
  const { userId } = data;
  try {
    if (!userId) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        `The provided arguments is invalid`
      );
    }

    const notificationResult = await admin
      .firestore()
      .collection("/notifications")
      .where("toUserId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(5)
      .get();

    const notifications = [];
    notificationResult.docs.forEach((doc) => {
      notifications.push({
        id: doc.id,
        ...doc.data(),
        createdAtISO: new Date(
          doc.data().createdAt._seconds * 1000
        ).toISOString(),
      });
    });
    return notifications;
  } catch (error) {
    functions.logger.error(error.message, { input: data });
    throw error;
  }
});

module.exports = {
  getNotifications,
};
