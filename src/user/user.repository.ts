import * as bcrypt from 'bcrypt';

import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserCredentialDto } from './dto/userCredential.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserRepository {
  private saltRounds = 10;
  constructor(private prisma: PrismaService) {}

  async createUser(userData: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        mobile: userData.mobile,
      },
    });
    if (user) {
      throw new ConflictException('user with this mobile already exist');
    }
    const hashedPassword = await bcrypt.hash(
      userData.password,
      this.saltRounds,
    );

    const newUser = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
    delete newUser.password;
    return newUser;
  }

  async checkCredentials({
    mobile,
    password,
  }: UserCredentialDto): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        mobile,
      },
    });
    if (!user || !(await bcrypt.compare(password, user.password))) return false;

    return true;
  }
}
