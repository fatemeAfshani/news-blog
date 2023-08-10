import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserCredentialDto {
  @ApiProperty()
  @IsString()
  mobile: string;

  @ApiProperty()
  @IsString()
  password: string;
}
