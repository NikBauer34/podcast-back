import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/CreateUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/registration')
  async registration(@Body() dto: CreateUserDto) {
    return this.authService.registration(dto)
  }
  @Post('/login')
  async login(@Body() dto: {nikname: string, password: string}) {
    return this.authService.login(dto)
  }
  @Post('/refresh')
  async refresh(@Body() dto: {refreshToken: string}) {
    return this.authService.refresh(dto.refreshToken)
  }
}
