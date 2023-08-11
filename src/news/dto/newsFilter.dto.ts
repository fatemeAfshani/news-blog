import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString, Matches } from 'class-validator';

export class NewsFilterDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Matches(/\d{4}\/\d{2}\/\d{2}/, {
    message: 'date format is invalid, example: 1402/05/20',
  })
  createdAt: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  id: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  tag: string;
}
