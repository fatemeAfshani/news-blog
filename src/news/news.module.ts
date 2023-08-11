import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { NewsRepository } from './news.repository';
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [UserModule, PrismaModule],
  providers: [NewsService, NewsRepository],
  controllers: [NewsController],
})
export class NewsModule {}
