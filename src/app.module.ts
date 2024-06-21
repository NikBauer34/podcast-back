import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { PodcastModule } from './podcast/podcast.module';
import { UserModule } from './user/user.module';
import { BucketModule } from './bucket/bucket.module';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    MongooseModule.forRoot(`${process.env.db_url}`),
    PodcastModule,
    UserModule,
    BucketModule,
    AuthModule,
    TokenModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
