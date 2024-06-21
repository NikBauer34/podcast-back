import { Module } from '@nestjs/common';
import { PodcastService } from './podcast.service';
import { PodcastController } from './podcast.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Podcast, PodcastSchema } from './podcast.model';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [MongooseModule.forFeature([{name: Podcast.name, schema: PodcastSchema}]), JwtModule.register({}), UserModule],
  providers: [PodcastService],
  controllers: [PodcastController]
})
export class PodcastModule {}
