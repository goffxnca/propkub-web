import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { EnvironmentModule } from '../environments/environment.module';
import { MailCronService } from './mail-cron.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/users.schema';

@Module({
  imports: [
    EnvironmentModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  providers: [MailService, MailCronService],
  exports: [MailService]
})
export class MailModule {}
