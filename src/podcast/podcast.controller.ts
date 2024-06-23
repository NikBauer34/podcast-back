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
}
