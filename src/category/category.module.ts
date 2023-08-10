import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { CategoryController } from './category.controller';
import { CategoryRepository } from './category.respositoy';
import { CategoryService } from './category.service';

@Module({
  imports: [UserModule, PrismaModule],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
})
export class CategoryModule {}
