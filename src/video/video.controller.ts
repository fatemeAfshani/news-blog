import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Body,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import { Express } from 'express';
import { VideoService } from './video.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Video } from '@prisma/client';
import { VideoFilterDto } from './dto/videoFilter.dto';
import { UpdateVideoDto } from './dto/updateVideo.dto';

@ApiTags('Videos')
@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'videos',
      }),
      fileFilter: (request, file, callback) => {
        if (!file.mimetype.includes('video')) {
          return callback(
            new BadRequestException('Provide a valid video'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async addVideo(@UploadedFile() file: Express.Multer.File) {
    console.log('#### file', file);
    return this.videoService.create({
      name: file.originalname,
      path: file.path,
      mimetype: file.mimetype,
    });
  }

  @Get('/stream/:id')
  @ApiResponse({
    status: 200,
    description: 'successful',
  })
  @ApiResponse({ status: 404, description: 'data not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  streamVideo(@Param('id', ParseIntPipe) id: number) {
    return this.videoService.getVideoStreamById(id);
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
    videoFilterDto?: VideoFilterDto,
  ): Promise<{ videos: Video[]; totalCount: number }> {
    return this.videoService.getAll({ limit, page, videoFilterDto });
  }

  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'successful',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  getVideoData(@Param('id', ParseIntPipe) id: number) {
    return this.videoService.getVideoData(id);
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
    @Body() data: UpdateVideoDto,
  ): Promise<Video> {
    return this.videoService.update(id, data);
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
  delete(@Param('id', ParseIntPipe) id: number): Promise<Video> {
    return this.videoService.delete(id);
  }
}
