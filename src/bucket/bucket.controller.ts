import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { BucketService } from './bucket.service';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('bucket')
export class BucketController {
  constructor(private bucketService: BucketService) {}

  @Post('upload')
@UseInterceptors(FileInterceptor('file'))
uploadFile(@UploadedFile() file: Express.Multer.File) {
  console.log(file.buffer, file.originalname)
  return this.bucketService.uploadFile(file.buffer, file.originalname)
  }

  // @Post('upload-mp3')
  // @UseInterceptors(FileInterceptor('file'))
  // uploadMp3(@Body() dto: {file: string}) {
  //   console.log(dto.file)
  // return this.bucketService.uploadMp3(dto.file)
  // }

  @Post('buffer')
  buffer(@Body() dto: {voice: string, type: string}) {
    return this.bucketService.bufferl(dto.voice, dto.type)
  }

  @Get('/audio/:id')
  getAudio(@Param('id') id: string) {
    return this.bucketService.getAudioUrl(id)
  }

  @Post('gen-image')
  genImage(@Body() dto: {text: string}) {
    return this.bucketService.genImage(dto.text)
  }

  @Get('/image/:id')
  getImage(@Param('id') id: string) {
    return this.bucketService.getImage(id)
  }
}
