import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from 'src/user/dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  singup(@Body() signupDto: SignupDto) {
    console.log(signupDto);
    this.authService.signup(signupDto);
  }
}
