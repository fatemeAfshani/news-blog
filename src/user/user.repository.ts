import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserCredentialDto } from './dto/userCredential.dto';
import { User } from '@prisma/client';
import { BaseRepository } from 'src/prisma/base.repository';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(prisma: PrismaService) {
    super(prisma, 'user');
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
