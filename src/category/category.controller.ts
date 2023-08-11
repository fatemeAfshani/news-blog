import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Category } from '@prisma/client';
import { CategoryService } from './category.service';
import { CategoryFilterDto } from './dto/categoryFilter.dto';
import { CreateCategoryDto } from './dto/createCategory.dto';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

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
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async createCategory(@Body() data: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(data);
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
    categoryFilterDto?: CategoryFilterDto,
  ): Promise<{ categories: Category[]; totalCount: number }> {
    return this.categoryService.getAll({ limit, page, categoryFilterDto });
  }

  @ApiResponse({
    status: 200,
    description: 'successful',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return this.categoryService.getOne(id);
  }
}
