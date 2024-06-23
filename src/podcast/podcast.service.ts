import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Podcast } from './podcast.model';
import { Model, Types } from 'mongoose';
import { CreatePodcastDto } from './dto/CreatePodcast.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.model';

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
  async getTranding() {
    let podcasts = await this.podcastModel.find({})
      .sort({'views': 'descending'})
      .limit(15)
    return podcasts
  }
  async search(text: string) {
    let podcasts = await this.podcastModel.find({})
      .where('podcastTitle').regex(text)
    return podcasts
  }
  async deletePodcast(podcastId: string, auth: string) {
    let token = this.jwtService.verify(auth, {secret: process.env.access_secret})
    const user = await this.userService.findById(token._id)
    if (!user) throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST)
    const podcast = await this.podcastModel.findById(podcastId)
    if (!podcast) throw new HttpException('Подкаст не найден', HttpStatus.BAD_REQUEST)
    if (podcast.authorId == user._id) throw new HttpException('Пользователь не автор подкаста', HttpStatus.BAD_REQUEST)
    const new_podcast = await this.podcastModel.findByIdAndDelete(podcast._id)
    return new_podcast
  }
  async isOwner(podcastId: string, auth: string) {
    let token = this.jwtService.verify(auth || '', {secret: process.env.access_secret})
    const user = await this.userService.findById(token._id)
    if (!user) return {isOwner: false}
    const podcast = await this.podcastModel.findById(podcastId)
    if (!podcast) throw new HttpException('Подкаст не найден', HttpStatus.BAD_REQUEST)
    if (podcast.authorId == user._id) return {isOwner: true}
    else return {isOwner: false}
  }
  async getSimilar(voiceType: string, podcastId: Types.ObjectId) {
    const podcasts = await this.podcastModel.find({})
      .where('voiceType').equals(voiceType)
      .limit(5)
    const new_podcasts = podcasts.filter(el => el._id !== podcastId)
    return new_podcasts
    
  }
  async getOne(id: string) {
    const podcast = await this.podcastModel.findById(id)
    if (!podcast) throw new HttpException('Подкаст не найден', HttpStatus.BAD_REQUEST)
    return podcast
  }
  async getTopPodcasters() {
    const podcasters = await this.userService.getAll()
    return podcasters
  }
  async getMost() {
    const podcasts = await this.podcastModel.find({})
      .sort({'views': 'descending'})
      .limit(5)
    return podcasts
  }
  async updateViews(podcastId: Types.ObjectId) {
    const podcast = await this.podcastModel.findById(podcastId)
    podcast.views += 1
    await podcast.save()
    console.log(podcast)
    return podcast
  }
  async getPodcastsByUser(userId: Types.ObjectId) {
    const user = await this.userService.findById(userId)
    const podcasts = await this.podcastModel.find({})
      .where('authorId').equals(user._id)
    return podcasts
  }
}
