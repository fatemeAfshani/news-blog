import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateNewsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ required: false, type: Number, isArray: true })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  categories: number[];

  @ApiProperty({ required: false, type: Number, isArray: true })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  tags: number[];
}
