import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { TagController } from './tag.controller';
import { TagRepository } from './tag.respositoy';
import { TagService } from './tag.service';

@Module({
  imports: [UserModule, PrismaModule],
  controllers: [TagController],
  providers: [TagService, TagRepository],
})
export class TagModule {}
