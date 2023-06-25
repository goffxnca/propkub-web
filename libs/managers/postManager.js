import { httpsCallable } from "firebase/functions";
import { firebaseFunctions } from "../firebase";

const getPostView = async (postId) => {
  const getPostView = httpsCallable(firebaseFunctions, "getPostView");
  return getPostView(postId);
};

const increasePostView = (postId) => {
  const increasePostViewFunc = httpsCallable(
    firebaseFunctions,
    "increasePostView"
  );
  increasePostViewFunc(postId).catch((error) => {
    throw error;
  });
};

const increasePhoneView = (postId) => {
  const increasePhoneViewFunc = httpsCallable(
    firebaseFunctions,
    "increasePhoneView"
  );
  increasePhoneViewFunc(postId).catch((error) => {
    throw error;
  });
};

const increaseLineView = (postId) => {
  const increaseLineViewFunc = httpsCallable(
    firebaseFunctions,
    "increaseLineView"
  );
  increaseLineViewFunc(postId).catch((error) => {
    throw error;
  });
};

export { getPostView, increasePostView, increasePhoneView, increaseLineView };
