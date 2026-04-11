import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvironmentModule } from '../environments/environment.module';
import { PostActions, PostActionsSchema } from './postActions.schema';
import { PostActionsService } from './postActions.service';
import { Post, PostSchema } from '../posts/posts.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: PostActions.name, schema: PostActionsSchema }
    ]),
    EnvironmentModule
  ],
  providers: [PostActionsService],
  exports: [PostActionsService]
})
export class PostActionsModule {}
