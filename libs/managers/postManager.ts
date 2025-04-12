import { httpsCallable, HttpsCallableResult } from "firebase/functions";
import { firebaseFunctions } from "../firebase";
import { GetPostViewResponse, IncreaseViewResponse } from "../../src/types/models/post";

const getPostView = async (postId: string): Promise<GetPostViewResponse> => {
  const getPostViewRef = httpsCallable(firebaseFunctions, "getPostView");
  const result = await getPostViewRef(postId);
  return (result as HttpsCallableResult<GetPostViewResponse>).data;
};

const increasePostView = async (postId: string): Promise<void> => {
  const increasePostViewRef = httpsCallable<string, IncreaseViewResponse>(
    firebaseFunctions,
    "increasePostView"
  );
  try {
    await increasePostViewRef(postId);
  } catch (error) {
    throw error;
  }
};

const increasePhoneView = async (postId: string): Promise<void> => {
  const increasePhoneViewRef = httpsCallable<string, IncreaseViewResponse>(
    firebaseFunctions,
    "increasePhoneView"
  );
  try {
    await increasePhoneViewRef(postId);
  } catch (error) {
    throw error;
  }
};

const increaseLineView = async (postId: string): Promise<void> => {
  const increaseLineViewRef = httpsCallable<string, IncreaseViewResponse>(
    firebaseFunctions,
    "increaseLineView"
  );
  try {
    await increaseLineViewRef(postId);
  } catch (error) {
    throw error;
  }
};

export { getPostView, increasePostView, increasePhoneView, increaseLineView };
