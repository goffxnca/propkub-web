import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EnvironmentService } from '../environments/environment.service';
import {
  PostActions,
  PostActionsDocument,
  PostActionType
} from './postActions.schema';
import { Post, PostDocument, PostStatus } from '../posts/posts.schema';
import { POST_ACTIONS_FLOW } from '../common/postActionsFlow';

@Injectable()
export class PostActionsService implements OnModuleInit {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
    @InjectModel(PostActions.name)
    private readonly postActionsModel: Model<PostActionsDocument>,

    private readonly envService: EnvironmentService
  ) {}

  async onModuleInit() {
    if (this.envService.isTest()) {
      return;
    }

    const count = await this.postActionsModel.estimatedDocumentCount();
    if (count === 0) {
      const posts = await this.postModel.find();
      const postActions = posts.map((post) => {
        //NOTE: For now to reduce migration complexity, just seed with 1 post 1 postAction with type 'CREATE'
        const postActionsResult: any = {
          type: PostActionType.CREATE,
          from: PostStatus.EMPTY,
          to: PostStatus.ACTIVE,
          postId: post._id,
          createdAt: post.createdAt,
          createdBy: post.createdBy,
          note: ''
        };
        return postActionsResult;
      });
      await this.postActionsModel.insertMany(postActions);
      console.log(`✅ Seeded ${postActions.length} post actions.`);
    }
  }

  async findByPostId(postId: string): Promise<PostActions[]> {
    return this.postActionsModel
      .find({ postId: new Types.ObjectId(postId) })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .exec();
  }

  async create(
    postAction: PostActionType,
    postId: string,
    userId: string
  ): Promise<void> {
    const action = POST_ACTIONS_FLOW.find((paf) => paf.action === postAction);
    if (!action) {
      throw new NotFoundException(`Post action:${postAction} not found`);
    }

    const postActionData: PostActions = {
      type: action.action,
      from: action.from,
      to: action.to,
      postId: postId,
      createdBy: userId,
      note: ''
    };

    await new this.postActionsModel(postActionData).save();
  }
}
