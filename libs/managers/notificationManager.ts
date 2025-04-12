import { httpsCallable, HttpsCallableResult } from "firebase/functions";
import { firebaseFunctions } from "../firebase";
import {
  GetNotificationsParams,
  GetNotificationsResponse,
  ReadNotificationParams,
  ReadNotificationResponse,
} from "../../src/types/models/notification";

const getNotifications = async ({
  userId,
}: GetNotificationsParams): Promise<GetNotificationsResponse> => {
  const getNotificationsRef = httpsCallable(
    firebaseFunctions,
    "getNotifications"
  );
  const result = await getNotificationsRef({ userId });
  return (result as HttpsCallableResult<GetNotificationsResponse>).data;
};

const readNotification = async ({
  notificationId,
}: ReadNotificationParams): Promise<ReadNotificationResponse> => {
  const readNotificationRef = httpsCallable(
    firebaseFunctions,
    "readNotification"
  );
  const result = await readNotificationRef({ notificationId });
  return (result as HttpsCallableResult<ReadNotificationResponse>).data;
};

export { getNotifications, readNotification };
