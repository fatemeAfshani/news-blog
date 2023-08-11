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
import { Tag } from '@prisma/client';
import { CreateTagDto } from './dto/createTag.dto';
import { TagFilterDto } from './dto/tagFilter.dto';
import { UpdateTagDto } from './dto/updateTag.dto';
import { TagService } from './tag.service';

@ApiTags('Tag')
@Controller('tag')
export class TagController {
  constructor(private tagService: TagService) {}

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
  async create(@Body() data: CreateTagDto): Promise<Tag> {
    return this.tagService.create(data);
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
    tagFilterDto?: TagFilterDto,
  ): Promise<{ tags: Tag[]; totalCount: number }> {
    return this.tagService.getAll({ limit, page, tagFilterDto });
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
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<Tag> {
    return this.tagService.getOne(id);
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
    @Body() { name }: UpdateTagDto,
  ): Promise<Tag> {
    return this.tagService.update(id, name);
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
  // deleteATask(@Param('id', ParseIntPipe) id: number): Promise<Tag> {
  //   return this.tagService.delete(id);
  // }
}
