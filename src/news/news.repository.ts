import * as moment from 'moment-jalaali';

import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { News, User } from '@prisma/client';
import { BaseRepository } from 'src/prisma/base.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNewsDto } from './dto/createNews.dto';
import { UpdateNewsDto } from './dto/updateNews.dto';

@Injectable()
export class NewsRepository extends BaseRepository<News> {
  private newsLogger = new Logger('newsRepository');

  constructor(prisma: PrismaService) {
    super(prisma, 'news');
  }

  async createNews(data: CreateNewsDto, user: User): Promise<News> {
    const alreadyExist = await this.prisma.news.findUnique({
      where: {
        title: data.title,
      },
    });
    if (alreadyExist) {
      throw new ConflictException('data already exist');
    }

    try {
      const news = await this.prisma.news.create({
        data: {
          title: data.title,
          content: data.content,
          createdAt: moment().format('jYYYY/jMM/jDD HH:mm:ss'),
          authorId: user.id,
          categories: {
            create:
              data.categories?.map((cat) => ({
                category: { connect: { id: cat } },
              })) || [],
          },
          tags: {
            create:
              data.tags?.map((tag) => ({
                tag: { connect: { id: tag } },
              })) || [],
          },
        },
      });
      return news;
    } catch (error) {
      this.newsLogger.error('#### error while creating news', error);
      throw new BadRequestException('unable to create news this data');
    }
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

  async updateNews(id: number, data: UpdateNewsDto): Promise<News> {
    const instance = await this.prisma.news.findUnique({
      where: { title: data.title },
    });
    if (instance) {
      throw new BadRequestException('unable to update with this data');
    }

    const updatedData = {};
    for (const field in data) {
      if (field === 'categories') {
        updatedData['categories'] = {
          deleteMany: {},
          create: data.categories.map((cat) => ({
            category: { connect: { id: cat } },
          })),
        };
      } else if (field === 'tags') {
        updatedData['tags'] = {
          deleteMany: {},
          create: data.tags.map((tag) => ({
            tag: { connect: { id: tag } },
          })),
        };
      } else {
        updatedData[field] = data[field];
      }
    }

    try {
      const news = await this.prisma.news.update({
        where: { id },
        data: updatedData,
      });
      return news;
    } catch (error) {
      this.newsLogger.error('#### error while updating news', error);
      throw new BadRequestException('unable to update news this data');
    }
  }
}
