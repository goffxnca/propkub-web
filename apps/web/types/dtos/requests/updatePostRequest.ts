import { CreatePostRequest } from './createPostRequest';

export type UpdatePostRequest = Partial<Omit<CreatePostRequest, 'postNumber'>>;
