import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateResetTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
