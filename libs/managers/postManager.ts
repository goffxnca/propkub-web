import { PostStatType } from '../../types/enums/postStatType';
import { apiClient } from '../client';

const increasePhoneView = async (postId: string): Promise<void> => {
  await apiClient.posts.increasePostStats(postId, PostStatType.PHONE_VIEWS);
};

const increaseLineView = async (postId: string): Promise<void> => {
  await apiClient.posts.increasePostStats(postId, PostStatType.LINE_VIEWS);
};

export { increasePhoneView, increaseLineView };
