import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { PodcastService } from './podcast.service';
import { CreatePodcastDto } from './dto/CreatePodcast.dto';
import { Types } from 'mongoose';

@Controller('podcast')
export class PodcastController {
  constructor(private podcastService: PodcastService) {}

  @Post('/create')
  create(@Body() dto: CreatePodcastDto, @Headers() headers: Record<string, string>) {
    const auth = headers.authorization.split(' ')[1]
    return this.podcastService.create(dto, auth)
  }

  @Get('/get-tranding')
  getTranding() {
    return this.podcastService.getTranding()
  }

  @Post('/get-by-title')
  getByTitle(@Body() dto: {search: string}) {
    return this.podcastService.search(dto.search)
  }
  @Post('/delete')
  deletePodcast(@Body() dto: {podcastId: string}, @Headers() headers: Record<string, string>) {
    const auth = headers.authorization.split(' ')[1]
    return this.podcastService.deletePodcast(dto.podcastId, auth)
  }
  @Post('/is-owner')
  isOwner(@Body() dto: {podcastId: string}, @Headers() headers: Record<string, string>) {
    const auth = headers.authorization.split(' ')[1]
    return this.podcastService.isOwner(dto.podcastId, auth)
  }
  @Post('/get-similar')
  getSimilar(@Body() dto: {voiceType: string, podcastId: Types.ObjectId}) {
    return this.podcastService.getSimilar(dto.voiceType, dto.podcastId)
  }
  @Get('/get-one/:id')
  getOne(@Param('id') id: string) {
    return this.podcastService.getOne(id)
  }
  @Get('/get-top')
  getTopPodcasters() {
    return this.podcastService.getTopPodcasters()
  }
  @Get('/get-most')
  getMost() {
    return this.podcastService.getMost()
  }
  @Get('/update-views/:id')
  updateViews(@Param('id') id: Types.ObjectId) {
    console.log(id)
    return this.podcastService.updateViews(id)
  }
  @Post('/by-user')
  byUser(@Body() dto: {userId: Types.ObjectId}) {
    return this.podcastService.getPodcastsByUser(dto.userId)
  }
}
