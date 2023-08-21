import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  phone: string;

  @IsString()
  name: string;
}
