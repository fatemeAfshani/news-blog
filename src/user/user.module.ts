import * as config from 'config';

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtStrategy } from './auth/jwt.stategy';
import { UsersController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

const { secret, expire } = config.get('jwt');

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret,
      signOptions: {
        expiresIn: expire, //1hour
      },
    }),
    PrismaModule,
  ],
  controllers: [UsersController],
  providers: [UserService, JwtStrategy, UserRepository],
  exports: [JwtStrategy, PassportModule],
})
export class UserModule {}
