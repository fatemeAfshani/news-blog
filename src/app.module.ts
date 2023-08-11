import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { TagModule } from './tag/tag.module';
import { NewsModule } from './news/news.module';
import { VideoModule } from './video/video.module';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    CategoryModule,
    TagModule,
    NewsModule,
    VideoModule,
  ],
  controllers: [],
})
export class AppModule {}
