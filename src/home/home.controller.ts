import { Controller, Post } from '@nestjs/common';
import { User } from 'src/user/decorators/user.decorator';

@Controller('home')
export class HomeController {
  @Post()
  async createHome(@User() user) {
    return user;
  }
}
