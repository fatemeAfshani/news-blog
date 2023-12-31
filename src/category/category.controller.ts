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
import { Category } from '@prisma/client';
import { CategoryService } from './category.service';
import { CategoryFilterDto } from './dto/categoryFilter.dto';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';

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
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return this.categoryService.getOne(id);
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
    @Body() { name }: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.update(id, name);
  }

  // @Delete(':id')
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard())
  // @ApiResponse({
  //   status: 200,
  //   description: 'successful',
  // })
  // @ApiResponse({
  //   status: 401,
  //   description: 'UnAuthorized',
  // })
  // @ApiResponse({ status: 404, description: 'unable to delete this data' })
  // @ApiResponse({ status: 500, description: 'Internal Server Error' })
  // delete(@Param('id', ParseIntPipe) id: number): Promise<Category> {
  //   return this.categoryService.delete(id);
  // }
}
