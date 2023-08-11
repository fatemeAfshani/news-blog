import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateVideoDto {
  @ApiProperty()
  @IsString()
  path: string;

  @ApiProperty()
  @IsString()
  mimetype: string;

  @ApiProperty()
  @IsString()
  name: string;
}
