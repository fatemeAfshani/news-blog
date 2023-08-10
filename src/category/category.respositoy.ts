import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { BaseRepository } from 'src/prisma/base.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryRepository extends BaseRepository<Category> {
  constructor(prisma: PrismaService) {
    super(prisma, 'category');
  }
}
