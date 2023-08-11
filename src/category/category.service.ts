import * as moment from 'moment-jalaali';

import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { CategoryRepository } from './category.respositoy';
import { CreateCategoryDto } from './dto/createCategory.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  create(data: CreateCategoryDto): Promise<Category> {
    return this.categoryRepository.create(
      {
        name: data.name,
        createdAt: moment().format('jYYYY/jMM/jDD HH:mm:ss'),
      },
      'name',
    );
  }

  getOne(id: number): Promise<Category> {
    return this.categoryRepository.findById(id);
  }

  async getAll({
    limit = 10,
    page = 0,
    categoryFilterDto,
  }): Promise<{ categories: Category[]; totalCount: number }> {
    const { instances, count } = await this.categoryRepository.getAll(
      +limit,
      limit * page,
      categoryFilterDto,
    );
    return {
      categories: instances,
      totalCount: count,
    };
  }

  update(id: number, name: string): Promise<Category> {
    return this.categoryRepository.updateUniqueFields(id, { name });
  }
}
