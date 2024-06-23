import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.model';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/CreateUser.dto';
import { JwtService } from '@nestjs/jwt';
import { PodcastService } from '../podcast/podcast.service';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>,
              private jwtService: JwtService) {}

  async create(dto: CreateUserDto) {
    const user = await this.userModel.create(dto)
    return user
  }
  async findByNikname(nikname: string) {
    const user = await this.userModel.findOne({nikname})
    return user
  }
  async findById(_id: Types.ObjectId) {
    const user = await this.userModel.findById(_id)
    return user
  }
  async getAll() {
    const users = await this.userModel.find({})
    return users
  }
  async getUserData(auth: string) {
    let token = this.jwtService.verify(auth || '', {secret: process.env.access_secret})
    const user = await this.userModel.findById(token._id)
    if (!user) throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST)
    return user
  }
  async getUserById(userId: Types.ObjectId) {
    const user = await this.userModel.findById(userId)
    if (!user) throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST)
    return user
  }
}
