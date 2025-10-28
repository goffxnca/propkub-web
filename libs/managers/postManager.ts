import { apiClient } from '../client';

const increasePhoneView = async (postId: string): Promise<void> => {
  await apiClient.posts.increasePostStats(postId, 'phone_views');
};

const increaseLineView = async (postId: string): Promise<void> => {
  await apiClient.posts.increasePostStats(postId, 'line_views');
};

export { increasePhoneView, increaseLineView };
