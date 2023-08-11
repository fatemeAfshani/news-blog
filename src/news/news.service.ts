import * as moment from 'moment-jalaali';

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { News, User } from '@prisma/client';
import { CreateNewsDto } from './dto/createNews.dto';

import { NewsRepository } from './news.repository';

@Injectable()
export class NewsService {
  private logger = new Logger('newsRepository');

  constructor(private readonly newsRepository: NewsRepository) {}
  async create(data: CreateNewsDto, user: User): Promise<News> {
    const categoriesQuery = this.newsRepository.makeQueryArray(
      'category',
      data.categories,
    );
    const tagsQuery = this.newsRepository.makeQueryArray('tag', data.tags);

    try {
      const news = await this.newsRepository.create(
        {
          title: data.title,
          content: data.content,
          createdAt: moment().format('jYYYY/jMM/jDD HH:mm:ss'),
          authorId: user.id,
          categories: {
            create: categoriesQuery,
          },
          tags: {
            create: tagsQuery,
          },
        },
        'title',
      );
      return news;
    } catch (error) {
      this.logger.error('#### error while creating news', error);
      throw new BadRequestException('unable to create news this data');
    }
  }

  getOne(id: number): Promise<News> {
    return this.newsRepository.getOneNews(id);
  }
}
