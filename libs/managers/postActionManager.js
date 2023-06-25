import { httpsCallable } from "firebase/functions";
import { firebaseFunctions } from "../firebase";

const getPostActions = async (postId) => {
  const getPostActionsRef = httpsCallable(firebaseFunctions, "getPostActions");
  return getPostActionsRef({ postId });
};

const adminMarkPostAsFulfilled = async (postId) => {
  const adminMarkPostAsFulfilledRef = httpsCallable(
    firebaseFunctions,
    "adminMarkPostAsFulfilled"
  );
  return adminMarkPostAsFulfilledRef({ postId, actionByAdmin: false });
};

export { getPostActions, adminMarkPostAsFulfilled };
