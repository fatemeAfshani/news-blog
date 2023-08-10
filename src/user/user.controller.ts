import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/createUser.dto';
import { UserCredentialDto } from './dto/userCredential.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userService: UserService) {}

  @Post('/signup')
  @ApiResponse({
    status: 201,
    description: 'successful sign up',
  })
  @ApiResponse({
    status: 400,
    description: 'invalid mobile  | password is too weak',
  })
  @ApiResponse({
    status: 409,
    description: 'user with this mobile already exist',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async signup(@Body() userData: CreateUserDto): Promise<User> {
    return this.userService.signup(userData);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  @ApiResponse({
    status: 201,
    description: 'successful login',
  })
  @ApiResponse({
    status: 401,
    description: 'invalid login',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async signin(
    @Body() userCredential: UserCredentialDto,
  ): Promise<{ accessToken: string }> {
    return this.userService.signin(userCredential);
  }
}
