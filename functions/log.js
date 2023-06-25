const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { REGION } = require("./libs/constant");

const addLog = functions.region(REGION).https.onCall(async (data) => {
  const { action, type, payload } = data;
  try {
    if (!action || !type || !payload) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        `Provided log data is invalid`
      );
    }

    await admin.firestore().collection("/_logs").doc().set({
      action,
      type,
      payload,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      status: "OK",
      message: `Log action:${action} type:${type} is created successfully`,
    };
  } catch (error) {
    functions.logger.error(error.message, { input: data });
    throw error;
  }
});

module.exports = {
  addLog,
};
