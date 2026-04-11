import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class MongoIdValidationPipe implements PipeTransform {
  transform(value: any) {
    if (process.env.NODE_ENV === 'test') {
      return value;
    }

    if (!isValidObjectId(value)) {
      throw new BadRequestException(`Invalid id format: ${value}`);
    }
    return value;
  }
}
