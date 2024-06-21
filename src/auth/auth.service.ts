import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { CreateUserDto } from 'src/user/dto/CreateUser.dto';
import { User } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt'
import { TokenService } from 'src/token/token.service';
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService,
              private userService: UserService,
              private tokenService: TokenService
  ) {}

  async login(dto: {password: string, nikname: string}) {
    const user = await this.validateUser(dto)
    const tokens = await this.generateTokens(user)
    return tokens
  }
  async registration(dto: CreateUserDto) {
    const candidate = await this.userService.findByNikname(dto.nikname)
    if (candidate) {
      throw new HttpException('Пользователь с таким никнеймом существует', HttpStatus.BAD_REQUEST)
    }
    const hashPassword = await bcrypt.hash(dto.password, 5)
    const user = await this.userService.create({...dto, password: hashPassword})
    const tokens = await this.generateTokens(user)
    let data = await this.tokenService.saveToken(user._id, tokens.refreshToken)
    return tokens
  }
  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException({message: 'Рефреш-токена нет!'})
    }
    const userData = await this.jwtService.verify(refreshToken, {secret: process.env.refresh_secret})
    const user = await this.userService.findById(userData._id)
    const tokens = await this.generateTokens(user)
    let data = await this.tokenService.saveToken(user._id, tokens.refreshToken)
    return tokens
  }

  private async generateTokens(user: User & {_id: Types.ObjectId}) {
    const payload = {_id: user._id}
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: '1d',
        secret: process.env.access_secret
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.refresh_secret
      }),
      expiresIn: new Date().setTime(new Date().getTime() + 5 * 60 * 1000),
      _id: user._id
    }
  }
  private async validateUser(userDto: {password: string, nikname: string}) {
    const user = await this.userService.findByNikname(userDto.nikname)
    if (!user) throw new UnauthorizedException({message: 'Некорректный никнейм или пароль'})
    const passwordEquals = await bcrypt.compare(userDto.password, user.password);
    if (user && passwordEquals) {
        return user;
    }
    throw new UnauthorizedException({message: 'Некорректный никнейм или пароль'})
  }
}
