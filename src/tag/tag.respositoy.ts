import { Injectable } from '@nestjs/common';
import { Tag } from '@prisma/client';
import { BaseRepository } from 'src/prisma/base.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TagRepository extends BaseRepository<Tag> {
  constructor(prisma: PrismaService) {
    super(prisma, 'tag');
  }
}
