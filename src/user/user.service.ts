import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/createUser.dto';
import { UserCredentialDto } from './dto/userCredential.dto';
import { Payload } from './auth/jwtPayload.type';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private saltRounds = 10;

  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepository,
  ) {}

  async signup(data: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, this.saltRounds);
    const user = await this.userRepository.create(
      { ...data, password: hashedPassword },
      'mobile',
    );
    delete user.password;
    return user;
  }

  async signin(
    userCredential: UserCredentialDto,
  ): Promise<{ accessToken: string }> {
    const isValidUser = await this.userRepository.checkCredentials(
      userCredential,
    );
    if (!isValidUser) {
      throw new UnauthorizedException('invalid login');
    }

    const payload: Payload = {
      mobile: userCredential.mobile,
    };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
