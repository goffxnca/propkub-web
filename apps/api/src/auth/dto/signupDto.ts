import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength
} from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsBoolean()
  isAgent: boolean;
}
