import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoIdValidationPipe } from './pipes/mongo-id.pipe';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [MongoIdValidationPipe],
  exports: [MongoIdValidationPipe]
})
export class CommonModule {}
