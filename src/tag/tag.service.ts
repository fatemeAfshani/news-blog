import * as moment from 'moment-jalaali';

import { Injectable } from '@nestjs/common';
import { Tag } from '@prisma/client';
import { TagRepository } from './tag.respositoy';
import { CreateTagDto } from './dto/createTag.dto';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  create(data: CreateTagDto): Promise<Tag> {
    return this.tagRepository.create(
      {
        name: data.name,
        createdAt: moment().format('jYYYY/jMM/jDD HH:mm:ss'),
      },
      'name',
    );
  }

  getOne(id: number): Promise<Tag> {
    return this.tagRepository.findById(id);
  }

  async getAll({
    limit = 10,
    page = 1,
    tagFilterDto,
  }): Promise<{ tags: Tag[]; totalCount: number }> {
    const { instances, count } = await this.tagRepository.getAll(
      +limit,
      limit * (page - 1),
      tagFilterDto,
    );
    return {
      tags: instances,
      totalCount: count,
    };
  }

  update(id: number, name: string): Promise<Tag> {
    return this.tagRepository.updateUniqueFields(id, { name });
  }

  delete(id: number): Promise<Tag> {
    return this.tagRepository.delete(id);
  }
}
