const {
  EMAIL_POST_CREATED,
  EMAIL_POST_MOVEMENT,
  EMAIL_POST_UPDATED,
  EMAIL_POST_FULFILLED,
  EMAIL_POST_CLOSED,
} = require("../constant");

const POST_ACTION_FLOWS = [
  {
    actionName: "CreatePost",
    actionLabel: "สร้างประกาศ",
    roles: ["agent", "admin"],
    fromStatus: "",
    toStatus: "active",
    fromSubStatus: "",
    toSubStatus: "created",
    email: {
      requireSend: true,
      templateId: EMAIL_POST_CREATED,
    },
    notification: {
      requireSend: false,
      notificationLabel: "",
    },
  },
  {
    actionName: "UpdatePost",
    actionLabel: "อัพเดทรายละเอียดประกาศ",
    roles: ["agent", "admin"],
    fromStatus: "active",
    toStatus: "active",
    fromSubStatus: "<CURRENT_VALUE>",
    toSubStatus: "<CURRENT_VALUE>",
    email: {
      requireSend: true,
      templateId: EMAIL_POST_UPDATED,
    },
    notification: {
      requireSend: false,
      notificationLabel: "",
    },
  },
  {
    actionName: "ReportPost",
    actionLabel: "ประกาศถูกรายงานผิดกฏ",
    roles: ["all"],
    fromStatus: "active",
    toStatus: "active",
    fromSubStatus: "<CURRENT_VALUE>",
    toSubStatus: "reported",
    email: {
      requireSend: true,
      templateId: "EMAIL_POST_REPORTED",
    },
    notification: {
      requireSend: true,
      notificationLabel: "ประกาศถูกรายงานผิดกฏ ({postNumber})",
    },
  },
  {
    actionName: "FulfillPost",
    actionLabel: "ประกาศปิดการขาย",
    roles: ["agent", "admin"],
    fromStatus: "active",
    toStatus: "inactive",
    fromSubStatus: "<CURRENT_VALUE>",
    toSubStatus: "fulfilled",
    email: {
      requireSend: true,
      templateId: EMAIL_POST_FULFILLED,
    },
    notification: {
      requireSend: true,
      notificationLabel: "ประกาศปิดการขาย ({postNumber})",
    },
  },
  {
    actionName: "ClosePost",
    actionLabel: "ปิดประกาศ",
    roles: ["admin"],
    fromStatus: "active",
    toStatus: "inactive",
    fromSubStatus: "<CURRENT_VALUE>",
    toSubStatus: "closed",
    email: {
      requireSend: true,
      templateId: EMAIL_POST_CLOSED,
    },
    notification: {
      requireSend: true,
      notificationLabel: "ประกาศถูกปิดใช้งาน ({postNumber})",
    },
  },
];

module.exports = {
  POST_ACTION_FLOWS,
};
