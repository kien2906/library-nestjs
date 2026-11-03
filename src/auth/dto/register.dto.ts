import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: String;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @MinLength(6)
  retypePassword: string;

  @IsString()
  phone: string;

  @IsString()
  fullName: string;
}
