import { Injectable, NotFoundException } from '@nestjs/common';
import { Video } from '@prisma/client';
import { BaseRepository } from 'src/prisma/base.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VideoRepository extends BaseRepository<Video> {
  constructor(prisma: PrismaService) {
    super(prisma, 'video');
  }

  async getOneVideo(id: number): Promise<Video> {
    const video = await this.prisma.video.findUnique({
      where: { id },
      include: {
        categories: { include: { category: true } },
      },
    });
    if (!video) {
      throw new NotFoundException('data not found');
    }
    return video;
  }
}
