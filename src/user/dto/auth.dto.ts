import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class SignupDto {
  @IsEmail({ message: 'Please Enter a Valid Email' })
  email: string;

  @IsNotEmpty()
  password: string;

  phone: string;

  @IsString()
  name: string;
}
