import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Podcast } from './podcast.model';
import { Model } from 'mongoose';
import { CreatePodcastDto } from './dto/CreatePodcast.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PodcastService {
  constructor(@InjectModel(Podcast.name) private podcastModel: Model<Podcast>,
              private jwtService: JwtService,
              private userService: UserService) {}

  async create(dto: CreatePodcastDto, auth: string) {
    let token = this.jwtService.verify(auth, {secret: process.env.access_secret})
    const user = await this.userService.findById(token._id)
    if (!user) throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST)
    let candidate = await this.podcastModel.findOne({podcastTitle: dto.podcastTitle})
    if (candidate) {
      throw new HttpException('Подкаст с таким названием существует', HttpStatus.BAD_REQUEST)
    }
    const podcast = await this.podcastModel.create({...dto, author: user.nikname, authorId: user._id, authorImageUrl: user.imageUrl})
    return podcast
  }
}
