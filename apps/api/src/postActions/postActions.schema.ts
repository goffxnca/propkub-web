import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { PostStatus } from '../posts/posts.schema';

export type PostActionsDocument = PostActions & Document;

export enum PostActionType {
  CREATE = 'create',
  UPDATE = 'update',
  SUSPENSE = 'suspense',
  RESTORE = 'restore',
  SELL = 'sell',
  CLOSE = 'close'
}

@Schema({
  collection: 'postActions',
  timestamps: {
    updatedAt: false
  }
})
export class PostActions {
  @Prop({ required: true, enum: PostActionType })
  type: PostActionType;

  @Prop({ required: true, enum: PostStatus })
  from: PostStatus;

  @Prop({ required: true, enum: PostStatus })
  to: PostStatus;

  @Prop({ type: Object })
  payload?: object;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
  postId: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: string;

  @Prop()
  note?: string;
}

export const PostActionsSchema = SchemaFactory.createForClass(PostActions);
