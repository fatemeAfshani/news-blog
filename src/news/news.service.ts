import { Injectable, Logger } from '@nestjs/common';
import { News, User } from '@prisma/client';
import { CreateNewsDto } from './dto/createNews.dto';

import { NewsRepository } from './news.repository';
import { UpdateNewsDto } from './dto/updateNews.dto';

@Injectable()
export class NewsService {
  constructor(private readonly newsRepository: NewsRepository) {}

  create(data: CreateNewsDto, user: User): Promise<News> {
    return this.newsRepository.createNews(data, user);
  }

  getOne(id: number): Promise<News> {
    return this.newsRepository.getOneNews(id);
  }

  async getAll({
    limit = 10,
    page = 0,
    newsFilterDto,
  }): Promise<{ news: News[]; totalCount: number }> {
    const { instances, count } = await this.newsRepository.getAll(
      +limit,
      limit * page,
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

  update(id: number, data: UpdateNewsDto): Promise<News> {
    return this.newsRepository.updateNews(id, data);
  }
}
