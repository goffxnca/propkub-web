import { Module } from '@nestjs/common';
import { AdminUsersModule } from './users/admin-users.module';

@Module({
  imports: [AdminUsersModule]
})
export class AdminModule {}
