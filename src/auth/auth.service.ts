import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';

interface SignupParams {
  email: string;
  password: string;
  name: string;
  phone: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async signup({ email, password, name, phone }: SignupParams) {
    const userExist = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (userExist) {
      return {
        error: 'User already exists',
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(hashedPassword);

    const user = await this.prismaService.user.create({
      data: {
        email,
        name,
        phone,
        password: hashedPassword,
        userType: UserType.BUYER,
      },
    });

    const token = await jwt.sign(
      {
        name,
        id: user.id,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: '1d' },
    );
    return token;
  }
}
