import { Global, Module } from '@nestjs/common';
import { EnvironmentService } from './environment.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [EnvironmentService],
  exports: [EnvironmentService]
})
export class EnvironmentModule {}
