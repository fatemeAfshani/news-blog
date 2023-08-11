import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTagDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
