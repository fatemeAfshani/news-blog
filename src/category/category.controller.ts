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
import { Category } from '@prisma/client';
import { CategoryService } from './category.service';
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
