import { PostActionType } from '../postActions/postActions.schema';
import { PostStatus } from '../posts/posts.schema';

export interface PostActionFlow {
  action: PostActionType;
  from: PostStatus;
  to: PostStatus;
}

const POST_ACTIONS_FLOW: PostActionFlow[] = [
  {
    action: PostActionType.CREATE,
    from: PostStatus.EMPTY,
    to: PostStatus.ACTIVE
  },
  {
    action: PostActionType.UPDATE,
    from: PostStatus.ACTIVE,
    to: PostStatus.ACTIVE
  },
  {
    action: PostActionType.SUSPENSE,
    from: PostStatus.ACTIVE,
    to: PostStatus.HOLD
  },
  {
    action: PostActionType.RESTORE,
    from: PostStatus.HOLD,
    to: PostStatus.ACTIVE
  },
  {
    action: PostActionType.SELL,
    from: PostStatus.ACTIVE,
    to: PostStatus.SOLD
  },
  {
    action: PostActionType.CLOSE,
    from: PostStatus.ACTIVE,
    to: PostStatus.CLOSED
  }
];

export { POST_ACTIONS_FLOW };
