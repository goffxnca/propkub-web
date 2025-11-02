import { Post } from '../../models/post';

export type PostSitemapResponse = Pick<
  Post,
  '_id' | 'slug' | 'createdAt' | 'updatedAt'
>;
