import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export abstract class BaseRepository<T> {
  constructor(
    protected readonly prisma: PrismaService,
    private readonly modelName: string,
  ) {}

  async create(data: any, uniqueProperty: string): Promise<T> {
    const instance = await this.prisma[this.modelName].findUnique({
      where: {
        [uniqueProperty]: data[uniqueProperty],
      },
    });
    if (instance) {
      throw new ConflictException('data already exist');
    }

    return this.prisma[this.modelName].create({
      data,
    });
  }

  async findById(id: number): Promise<T | null> {
    const instance = await this.prisma[this.modelName].findUnique({
      where: { id },
    });
    if (!instance) {
      throw new NotFoundException('data not found');
    }
    return instance;
  }

  async getAll(
    limit = 10,
    offset = 0,
    searchFilter: object,
  ): Promise<{ instances: T[]; count: number }> {
    const whereCondition = this.createWhereCondition(searchFilter);

    const [instances, count] = await this.prisma.$transaction([
      this.prisma[this.modelName].findMany({
        take: limit,
        skip: offset,
        orderBy: {
          id: 'desc',
        },
        where: whereCondition,
      }),
      this.prisma[this.modelName].count({ where: whereCondition }),
    ]);

    return { instances, count };
  }

  async update(id: number, data: any): Promise<T | null> {
    return this.prisma[this.modelName].update({ where: { id }, data });
  }

  async delete(id: number): Promise<T | null> {
    return this.prisma[this.modelName].delete({ where: { id } });
  }

  private createWhereCondition(searchFilter: object) {
    const whereCondition = {};
    for (const filter in searchFilter) {
      if (filter === 'id') {
        whereCondition[filter] = {
          equals: +searchFilter[filter],
        };
      } else {
        whereCondition[filter] = {
          contains: searchFilter[filter],
        };
      }
    }
    return whereCondition;
  }
}
