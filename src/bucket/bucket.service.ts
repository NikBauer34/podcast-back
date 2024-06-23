import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import EasyYandexS3 from 'easy-yandex-s3'
import * as path from 'path'
import * as uuid from 'uuid'
import * as fs from 'fs'
import * as googleTTs from 'google-tts-api'
@Injectable()
export class BucketService {
  s3: EasyYandexS3
  constructor() {
    this.s3 = new EasyYandexS3({
      auth: {
        accessKeyId: process.env.accessKeyId,
        secretAccessKey: process.env.secretAccessKey
      },
      Bucket: process.env.Bucket,
      debug: process.env.NODE_ENV == 'development' ? true : false
    })
  }
  async uploadFile(file: Buffer, fileName: string) {
    let file_name = uuid.v4() + path.extname(fileName)
    console.log(file_name)
    let upload = await this.s3.Upload({
      buffer: file,
      name: file_name
    },
  '/test/')
    if (!upload) throw new HttpException('Не удалось загрузить файл', HttpStatus.BAD_REQUEST)
    if (upload instanceof Array) return {file_path: upload[0].Location}
    return {file_path: upload.Location}
  }
  async saveFile () {
    const url = googleTTs.getAudioUrl('Привет', {
      lang: 'ru',
      slow: false,
      host: 'https://translate.google.com'
    })
    return url
};

  async bufferl(voice: string, type: string) {
    // let url = await this.saveFile()
    // return url
    const res = await axios({
      method: 'POST',
      url: `https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize?text="${voice}"&voice=${type}&format=mp3`,
      responseType: 'stream',
      headers: {
        Authorization: 'Api-Key AQVNxSp8UIr45kqDWFzmOQYwgc2Eh9LnicSjCPqh'
      }
    })
    let filename = uuid.v4() + '.mp3'
    await res.data.pipe(fs.createWriteStream(path.resolve(__dirname, filename)))
    return filename
  }
  async genImage(text: string) {
    const res = await axios.post('https://llm.api.cloud.yandex.net/foundationModels/v1/imageGenerationAsync', {
      modelUri: "art://b1gfg98j9uokh5a0plmq/yandex-art/latest",
      generationOptions: {
        seed: 17
      },
      messages: [
        {
          weight: 1,
          text
        }
      ]
    }, {
      headers: {
        Authorization: 'Api-Key AQVNxSp8UIr45kqDWFzmOQYwgc2Eh9LnicSjCPqh'
      }
    })
    return res.data
    
  }
  async getAudioUrl(filename: string) {
    if (!fs.existsSync(path.resolve(__dirname, filename))) {
      throw new HttpException('Нет файла', HttpStatus.BAD_REQUEST)
    }
    let buffer = fs.readFileSync(path.resolve(__dirname, filename))
    let upload = await this.s3.Upload({
      buffer,
      name: filename
    },
  '/test/')
    fs.rmSync(path.resolve(__dirname, filename))
    if (!upload) throw new HttpException('Не удалось загрузить файл', HttpStatus.BAD_REQUEST)
    if (upload instanceof Array) return {file_path: upload[0].Location}
    return {file_path: upload.Location}
  }
  async getImage(id:string) {
    const res = await axios.get('https://llm.api.cloud.yandex.net:443/operations/' + id, {
      headers: {
        Authorization: 'Api-Key AQVNxSp8UIr45kqDWFzmOQYwgc2Eh9LnicSjCPqh'
      }
    })
    console.log(res.data)
    if (!res.data.response) {
      throw new HttpException('Пока изображение не сгенерировалось, повторите через пару секунд', HttpStatus.BAD_REQUEST)
    }
    let buff = Buffer.from(res.data.response.image, 'base64')
    let filename = uuid.v4() + '.jpeg'
    let upload = await this.s3.Upload({
      buffer: buff,
      name: filename
    },
  '/test/')
    if (!upload) throw new HttpException('Не удалось загрузить файл', HttpStatus.BAD_REQUEST)
    if (upload instanceof Array) return {file_path: upload[0].Location}
    return {file_path: upload.Location}
  }
}

