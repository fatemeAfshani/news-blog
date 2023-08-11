import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [UserModule, PrismaModule, CategoryModule, TagModule],
  controllers: [],
})
export class AppModule {}
