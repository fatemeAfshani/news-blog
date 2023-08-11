import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class UpdateVideoDto {
  @ApiProperty({ required: false, type: Number, isArray: true })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  categories: number[];
}
