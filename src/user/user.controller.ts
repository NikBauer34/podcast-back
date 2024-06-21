import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/CreateUser.dto';

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
}
