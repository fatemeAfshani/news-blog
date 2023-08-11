import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { News, User } from '@prisma/client';
import { GetUser } from 'src/user/user.decorator';
import { CreateNewsDto } from './dto/createNews.dto';
import { NewsFilterDto } from './dto/newsFilter.dto';
import { UpdateNewsDto } from './dto/updateNews.dto';
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

  @Get('')
  @ApiResponse({
    status: 200,
    description: 'successful',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiResponse({
    status: 400,
    description: 'date format is invalid, example: 1402/05/20',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
  })
  @ApiQuery({
    name: 'page',
    required: false,
  })
  async getAll(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
    @Query()
    newsFilterDto?: NewsFilterDto,
  ): Promise<{ news: News[]; totalCount: number }> {
    return this.newsService.getAll({ limit, page, newsFilterDto });
  }

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

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiResponse({
    status: 200,
    description: 'successful',
  })
  @ApiResponse({ status: 400, description: 'unable to update with this data' })
  @ApiResponse({
    status: 401,
    description: 'UnAuthorized',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateNewsDto,
  ): Promise<News> {
    return this.newsService.update(id, data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiResponse({
    status: 200,
    description: 'successful',
  })
  @ApiResponse({
    status: 401,
    description: 'UnAuthorized',
  })
  @ApiResponse({ status: 404, description: 'unable to delete' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  deleteATask(@Param('id', ParseIntPipe) id: number): Promise<News> {
    return this.newsService.delete(id);
  }
}
