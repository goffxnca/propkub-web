import { apiClient } from "../client";

const increasePostView = async (postId: string): Promise<void> => {
  await apiClient.posts.incrementViews(postId);
};

const increasePhoneView = async (postId: string): Promise<void> => {
  await apiClient.posts.increasePostStats(postId, "phone_views");
};

const increaseLineView = async (postId: string): Promise<void> => {
  await apiClient.posts.increasePostStats(postId, "line_views");
};

export { increasePostView, increasePhoneView, increaseLineView };
