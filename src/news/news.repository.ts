import { Injectable, NotFoundException } from '@nestjs/common';
import { News } from '@prisma/client';
import { BaseRepository } from 'src/prisma/base.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NewsRepository extends BaseRepository<News> {
  constructor(prisma: PrismaService) {
    super(prisma, 'news');
  }

  async getOneNews(id: number): Promise<News> {
    const news = await this.prisma.news.findUnique({
      where: { id },
      include: {
        tags: { include: { tag: true } },
        categories: { include: { category: true } },
        author: {},
      },
    });
    if (!news) {
      throw new NotFoundException('data not found');
    }
    await this.prisma.news.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    return news;
  }

  makeQueryArray(type: 'category' | 'tag', data: number[] = []) {
    const query = [];
    data.forEach((element) => {
      query.push({
        [type]: {
          connect: {
            id: element,
          },
        },
      });
    });

    return query;
  }
}
