import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { VideoController } from './video.controller';
import { VideoRepository } from './video.repository';
import { VideoService } from './video.service';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [VideoController],
  providers: [VideoService, VideoRepository],
})
export class VideoModule {}
