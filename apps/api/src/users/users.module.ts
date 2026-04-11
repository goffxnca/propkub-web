import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User, UserSchema } from './users.schema';
import { EnvironmentModule } from '../environments/environment.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    EnvironmentModule
  ],
  providers: [UsersService],
  controllers: [],
  exports: [UsersService]
})
export class UsersModule {}
