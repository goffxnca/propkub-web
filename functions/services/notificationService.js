const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { REGION } = require("../libs/constant");

const readNotification = functions
  .region(REGION)
  .https.onCall(async (data, context) => {
    const { notificationId } = data;
    const userId = context?.auth?.uid || "NO_UID";
    const userName = context?.auth?.token?.name || "NO_UNAME";

    //TODO: Create middleware to extract user data & handling when no user auth provided

    try {
      if (!notificationId) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          `The provided arguments is invalid`
        );
      }

      const notificationDoc = await admin
        .firestore()
        .collection("/notifications")
        .doc(notificationId)
        .get();

      if (!notificationDoc.exists) {
        throw new functions.https.HttpsError(
          "not-found",
          `Notification id: '${notificationId}' not found`
        );
      }

      const notification = {
        id: notificationDoc.id,
        ...notificationDoc.data(),
      };
      const { read } = notification;
      if (read) {
        throw new functions.https.HttpsError(
          "unavailable",
          `Notification id: '${notificationId}' is already read`
        );
      }

      functions.logger.info({ providedData: data, providedContext: context });

      await admin
        .firestore()
        .collection("/notifications")
        .doc(notificationId)
        .update({
          read: true,
          readAt: admin.firestore.FieldValue.serverTimestamp(),
          readBy: {
            userId: userId,
            name: userName,
          },
        });

      const successMessage = `Read notification id:${notificationId} successfully`;
      functions.logger.info(successMessage);
      return successMessage;
    } catch (error) {
      functions.logger.error(error.message, { input: data });
      throw error;
    }
  });

module.exports = {
  readNotification,
};
