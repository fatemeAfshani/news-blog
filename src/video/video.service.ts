import * as moment from 'moment-jalaali';
import * as rangeParser from 'range-parser';
import { stat } from 'fs/promises';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { CreateVideoDto } from './dto/createVideo.dto';
import { VideoRepository } from './video.repository';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Video } from '@prisma/client';
import { UpdateVideoDto } from './dto/updateVideo.dto';

@Injectable()
export class VideoService {
  private logger = new Logger('videoService');
  constructor(private readonly videoRepository: VideoRepository) {}

  create({ path, mimetype, name }: CreateVideoDto) {
    return this.videoRepository.create(
      {
        path,
        name,
        mimetype,
        createdAt: moment().format('jYYYY/jMM/jDD HH:mm:ss'),
      },
      'name',
    );
  }

  getVideoData(id: number): Promise<Video> {
    return this.videoRepository.getOneVideo(id);
  }

  async getAll({
    limit = 10,
    page = 1,
    videoFilterDto,
  }): Promise<{ videos: Video[]; totalCount: number }> {
    const { instances, count } = await this.videoRepository.getAll(
      +limit,
      limit * (page - 1),
      videoFilterDto,
      {
        categories: { include: { category: true } },
      },
    );
    //todo: delete path to videos
    return {
      videos: instances,
      totalCount: count,
    };
  }

  update(id: number, { categories }: UpdateVideoDto): Promise<Video> {
    return this.videoRepository.update(id, {
      categories: {
        deleteMany: {},
        create:
          categories.map((cat) => ({
            category: { connect: { id: cat } },
          })) || [],
      },
    });
  }

  async delete(id: number): Promise<Video> {
    try {
      const deleted = await this.videoRepository.update(id, {
        isDeleted: true,
      });
      return deleted;
    } catch (error) {
      this.logger.error('#### error in deleting news', error);
      throw new NotFoundException('unable to delete');
    }
  }

  private parseRange(range: string, fileSize: number) {
    const parseResult = rangeParser(fileSize, range);
    if (parseResult === -1 || parseResult === -2 || parseResult.length !== 1) {
      throw new BadRequestException();
    }
    return parseResult[0];
  }

  async getPartialVideoStream(id: number, range: string) {
    const videoMetadata = await this.videoRepository.findById(id);
    const videoPath = join(process.cwd(), videoMetadata.path);
    const fileSize = (await stat(videoPath)).size;
    const { start, end } = this.parseRange(range, fileSize);

    const stream = createReadStream(videoPath, {
      start,
      end,
      highWaterMark: 60,
    });

    const streamableFile = new StreamableFile(stream, {
      disposition: `inline; filename="${videoMetadata.name}"`,
      type: videoMetadata.mimetype,
    });

    const contentRange = `bytes ${start}-${end}/${fileSize}`;
    return {
      streamableFile,
      contentRange,
    };
  }

  async getVideoStreamById(id: number) {
    const video = await this.videoRepository.findById(id);
    const stream = createReadStream(join(process.cwd(), video.path));

    return new StreamableFile(stream, {
      disposition: `inline; filename="${video.name}"`,
      type: video.mimetype,
    });
  }
}
