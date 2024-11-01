import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import { Types } from 'mongoose';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  async register(@Body() dto: CreateUserDto) {
    return this.userService.create(dto)
  }

  @Get('/get-all')
  async getAll() {
    return this.userService.getAll()
  }

  @Get('/get-user-data')
  getUserData(@Headers() headers: Record<string, string>) {
    const auth = headers.authorization.split(' ')[1]
    return this.userService.getUserData(auth)
  }
  @Post('/get-by-id')
  getUserById(@Body() dto: {userId: Types.ObjectId}) {
    return this.userService.getUserById(dto.userId)
  }
}
