import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post, PostSchema } from './posts.schema';
import { User, UserSchema } from '../users/users.schema';
import { EnvironmentModule } from '../environments/environment.module';
import { MailModule } from '../mail/email.module';
import { UsersModule } from '../users/users.module';
import { PostActionsModule } from '../postActions/postActions.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema }
    ]),
    EnvironmentModule,
    UsersModule,
    MailModule,
    PostActionsModule
  ],
  providers: [PostsService],
  controllers: [PostsController]
})
export class PostsModule {}
