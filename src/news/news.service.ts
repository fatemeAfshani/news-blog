import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { News, User } from '@prisma/client';
import { CreateNewsDto } from './dto/createNews.dto';

import { NewsRepository } from './news.repository';
import { UpdateNewsDto } from './dto/updateNews.dto';
import { NewsOrder } from './newsStatus.enum';

@Injectable()
export class NewsService {
  constructor(private readonly newsRepository: NewsRepository) {}

  private logger = new Logger('newsService');

  create(data: CreateNewsDto, user: User): Promise<News> {
    return this.newsRepository.createNews(data, user);
  }

  getOne(id: number): Promise<News> {
    return this.newsRepository.getOneNews(id);
  }

  async getAll({
    limit = 10,
    page = 1,
    newsFilterDto,
  }): Promise<{ news: News[]; totalCount: number }> {
    const { instances, count } = await this.newsRepository.getAll(
      +limit,
      limit * (page - 1),
      newsFilterDto,
      {
        tags: { include: { tag: true } },
        categories: { include: { category: true } },
        author: {},
      },
    );
    return {
      news: instances,
      totalCount: count,
    };
  }

  async getAllWithOrder({
    limit = 10,
    page = 1,
    order,
  }): Promise<{ news: News[]; totalCount?: number }> {
    if (order === NewsOrder.HOTESET) {
      return this.newsRepository.hotestNews();
    }
    const orderBy = {};
    switch (order) {
      case NewsOrder.LATEST:
        orderBy['createdAt'] = 'desc';
        break;
      case NewsOrder.MOST_LIKED:
        orderBy['likes'] = 'desc';
        break;
      case NewsOrder.MOST_VIEWED:
        orderBy['views'] = 'desc';
        break;
      default:
        orderBy['id'] = 'desc';
    }

    const { instances, count } = await this.newsRepository.getAll(
      +limit,
      limit * (page - 1),
      {},
      {
        tags: { include: { tag: true } },
        categories: { include: { category: true } },
        author: {},
      },
      orderBy,
    );
    return {
      news: instances,
      totalCount: count,
    };
  }

  update(id: number, data: UpdateNewsDto): Promise<News> {
    return this.newsRepository.updateNews(id, data);
  }

  async delete(id: number): Promise<News> {
    try {
      const deleted = await this.newsRepository.update(id, { isDeleted: true });
      return deleted;
    } catch (error) {
      this.logger.error('#### error in deleting news', error);
      throw new NotFoundException('unable to delete');
    }
  }

  async likeANews(id: number, ip: string): Promise<News> {
    const news = await this.newsRepository.findById(id);
    if (news.likeIps.includes(ip)) {
      throw new BadRequestException('already liked');
    }
    news.likeIps.push(ip);
    return this.newsRepository.update(id, {
      likes: {
        increment: 1,
      },
      likeIps: news.likeIps,
    });
  }
}
