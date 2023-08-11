import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { News, User } from '@prisma/client';
import { GetUser } from 'src/user/user.decorator';
import { CreateNewsDto } from './dto/createNews.dto';
import { NewsService } from './news.service';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}

  @Post('')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiResponse({
    status: 201,
    description: 'successful',
  })
  @ApiResponse({
    status: 401,
    description: 'UnAuthorized',
  })
  @ApiResponse({ status: 400, description: 'unable to create news this data' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async create(
    @Body() data: CreateNewsDto,
    @GetUser() user: User,
  ): Promise<News> {
    return this.newsService.create(data, user);
  }

  //get all

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'successful',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<News> {
    return this.newsService.getOne(id);
  }
}
