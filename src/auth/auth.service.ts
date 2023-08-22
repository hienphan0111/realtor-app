import { HttpException, Injectable } from '@nestjs/common';
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

interface SigninParams {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async generateToken(name: string, id: number) {
    const token = await jwt.sign(
      {
        name,
        id,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: '1d' },
    );
    return token;
  }

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

    const token = await this.generateToken(user.name, user.id)
    return token;
  }

  async signin({ email, password }: SigninParams) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpException('Invalid credentials', 400);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new HttpException('Invalid credentials', 400);
    }

    const token = await this.generateToken(user.name, user.id);

    return token;
  }
}
