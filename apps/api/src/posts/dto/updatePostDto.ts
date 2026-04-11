import { CreatePostDto } from './createPostDto';
import { PartialType, OmitType } from '@nestjs/swagger';

export class UpdatePostDto extends PartialType(
  OmitType(CreatePostDto, ['postNumber']),
  {
    skipNullProperties: false
  }
) {}
