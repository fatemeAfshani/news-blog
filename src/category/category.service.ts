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
        createdAt: moment().format('jYYYY/jM/jD HH:mm:ss'),
      },
      'name',
    );
  }

  getOne(id: number): Promise<Category> {
    return this.categoryRepository.findById(id);
  }
}
