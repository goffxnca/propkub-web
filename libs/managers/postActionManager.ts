import { httpsCallable, HttpsCallableResult } from "firebase/functions";
import { firebaseFunctions } from "../firebase";
import {
  GetPostActionsParams,
  GetPostActionsResponse,
  AdminMarkPostAsFulfilledParams,
  AdminMarkPostAsFulfilledResponse,
} from "../../src/types/postAction";

const getPostActions = async (
  postId: string
): Promise<GetPostActionsResponse> => {
  const getPostActionsRef = httpsCallable(firebaseFunctions, "getPostActions");
  const result = await getPostActionsRef({ postId });
  return (result as HttpsCallableResult<GetPostActionsResponse>).data;
};

const adminMarkPostAsFulfilled = async (
  postId: string
): Promise<AdminMarkPostAsFulfilledResponse> => {
  const adminMarkPostAsFulfilledRef = httpsCallable(
    firebaseFunctions,
    "adminMarkPostAsFulfilled"
  );
  const result = await adminMarkPostAsFulfilledRef({ postId, actionByAdmin: false });
  return (result as HttpsCallableResult<AdminMarkPostAsFulfilledResponse>).data;
};

export { getPostActions, adminMarkPostAsFulfilled };
