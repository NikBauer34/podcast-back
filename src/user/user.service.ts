import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.model';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/CreateUser.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

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
}
