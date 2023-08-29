import { Controller, Post, UseGuards } from '@nestjs/common';
import { UserType } from '@prisma/client';
import { AuthGuard } from 'guards/auth.guard';
import { Roles } from 'src/user/decorators/roles.decorator';
import { User } from 'src/user/decorators/user.decorator';

@Controller('home')
export class HomeController {
  @Roles(UserType.ADMIN)
  @UseGuards(AuthGuard)
  @Post()
  async createHome(@User() user) {
    return user;
  }
}
