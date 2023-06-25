import { httpsCallable } from "firebase/functions";
import { firebaseFunctions } from "../firebase";

const getNotifications = async (userId) => {
  const getNotificationsRef = httpsCallable(
    firebaseFunctions,
    "getNotifications"
  );
  return getNotificationsRef({ userId });
};

const readNotification = async (notificationId) => {
  const readNotificationRef = httpsCallable(
    firebaseFunctions,
    "readNotification"
  );
  return readNotificationRef({ notificationId });
};

export { getNotifications, readNotification };
