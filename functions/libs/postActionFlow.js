const admin = require("firebase-admin");
const { NO_REPLY_EMAIL } = require("./constant");
const { sendEmail } = require("./mail");
const { POST_ACTION_FLOWS } = require("./constants/postActionFlowConstants");

const addPostAction = async ({
  post,
  actionName,
  actionNote = "",
  additional = {},
  addPostActionByAdmin,
  customEmailTemplateData,
}) => {
  if (!post || !actionName) {
    throw new Error(`Input values for 'addPostAction()' are invalid`);
  }

  const {
    postId,
    postNumber,
    status: currentStatus,
    subStatus: currentSubStatus,
    title,
    isMember,
    createdBy,
  } = post;
  const postActionFlow = POST_ACTION_FLOWS.find(
    (flow) => flow.actionName === actionName
  );

  if (!postActionFlow) {
    throw new Error(`Action flow for:'${actionName}' is not found`);
  }

  const targetStatus =
    postActionFlow.toStatus === "<CURRENT_VALUE>"
      ? currentStatus
      : postActionFlow.toStatus;

  const targetSubStatus =
    postActionFlow.toSubStatus === "<CURRENT_VALUE>"
      ? currentSubStatus
      : postActionFlow.toSubStatus;

  const toBeUpdatedPost = {
    status: targetStatus,
    subStatus: targetSubStatus,
  };

  const actionCreatedBy = addPostActionByAdmin
    ? { userId: "<ADMIN>", name: "Admin" }
    : {
        userId: createdBy.userId || "",
        name: createdBy.name || "",
      };

  if (actionName !== "CreatePost") {
    toBeUpdatedPost.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    toBeUpdatedPost.updatedBy = { ...actionCreatedBy };
  }

  //Update post statuses
  await admin
    .firestore()
    .collection("/posts")
    .doc(postId)
    .update(toBeUpdatedPost);

  //Add post actions
  const newPostActionDocRef = admin
    .firestore()
    .collection("/postActions")
    .doc();

  await newPostActionDocRef.set({
    actionName: postActionFlow.actionName || "",
    actionLabel: postActionFlow.actionLabel || "",
    fromStatus: currentStatus || "",
    toStatus: targetStatus || "",
    fromSubStatus: currentSubStatus || "",
    toSubStatus: targetSubStatus || "",
    postId: postId || "",
    emailSent: postActionFlow.email.requireSend,
    notiSent: postActionFlow.notification.requireSend,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    createdBy: actionCreatedBy,
    note: actionNote,
    additional,
  });

  //Send notification
  if (isMember && postActionFlow.notification.requireSend) {
    await admin
      .firestore()
      .collection("/notifications")
      .doc()
      .set({
        type: "post",
        title: postActionFlow.notification.notificationLabel.replace(
          "{postNumber}",
          postNumber
        ),
        toUserId: createdBy.userId,
        actionId: newPostActionDocRef.id,
        refId: postId,
        href: `/account/posts/${postId}`,
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        createdBy: actionCreatedBy,
      });
  }

  //Send email
  if (isMember && postActionFlow.email.requireSend) {
    await sendEmail({
      from: NO_REPLY_EMAIL,
      to: createdBy.email,
      templateId: postActionFlow.email.templateId,
      templateData: {
        recipientName: createdBy.name,
        postNumber: postNumber + "",
        postTitle: title,
        ...(customEmailTemplateData || {}),
      },
    });
  }
};

module.exports = {
  addPostAction,
};
