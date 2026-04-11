import { Post } from '@/types/models/post';

export type PostSitemapResponse = Pick<
  Post,
  '_id' | 'slug' | 'createdAt' | 'updatedAt'
>;
