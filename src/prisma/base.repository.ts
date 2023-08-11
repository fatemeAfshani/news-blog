import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export abstract class BaseRepository<T> {
  private logger = new Logger('baseRepository');
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
    searchFilter: object = {},
    include: object = {},
    orderBy: object = { id: 'desc' },
  ): Promise<{ instances: T[]; count: number }> {
    const whereCondition = this.createWhereCondition(searchFilter);

    const [instances, count] = await this.prisma.$transaction([
      this.prisma[this.modelName].findMany({
        take: limit,
        skip: offset,
        orderBy,
        where: whereCondition,
        include,
      }),
      this.prisma[this.modelName].count({ where: whereCondition }),
    ]);

    return { instances, count };
  }

  async update(id: number, data: any): Promise<T | null> {
    return this.prisma[this.modelName].update({ where: { id }, data });
  }

  async updateUniqueFields(id: number, data: any): Promise<T> {
    const instance = await this.prisma[this.modelName].findUnique({
      where: data,
    });
    if (instance) {
      throw new BadRequestException('unable to update with this data');
    }
    return this.prisma[this.modelName].update({ where: { id }, data });
  }

  async delete(id: number): Promise<T | null> {
    try {
      const deleted = await this.prisma[this.modelName].delete({
        where: { id },
      });

      return deleted;
    } catch (error) {
      this.logger.error('#### error in deleting ', error);
      throw new NotFoundException('unable to delete this data');
    }
  }

  private createWhereCondition(searchFilter: object) {
    const whereCondition = {};
    for (const filter in searchFilter) {
      switch (filter) {
        case 'id':
          whereCondition[filter] = {
            equals: +searchFilter[filter],
          };
          break;
        case 'category':
          whereCondition['categories'] = {
            some: {
              category: {
                name: {
                  contains: searchFilter[filter],
                },
              },
            },
          };
          break;
        case 'tag':
          whereCondition['tags'] = {
            some: {
              tag: {
                name: {
                  contains: searchFilter[filter],
                },
              },
            },
          };
          break;
        default:
          whereCondition[filter] = {
            contains: searchFilter[filter],
          };
          break;
      }
    }

    return whereCondition;
  }
}
