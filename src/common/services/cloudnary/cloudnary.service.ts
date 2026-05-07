import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { v2 as cloudnary } from 'cloudinary'
import { Readable } from 'stream'

@Injectable()
export class CloudnaryService {
  constructor(private readonly configService: ConfigService) {
    cloudnary.config({
      cloud_name: configService.getOrThrow<string>('CLOUDNARY_CLOUD_NAME'),
      api_key: configService.getOrThrow<string>('CLOUDNARY_API_KEY'),
      api_secret: configService.getOrThrow<string>('CLOUDNARY_API_SECRET'),
    })
  }

  async upload({
    file,
    folder,
    name,
  }: {
    file: Express.Multer.File
    name: string
    folder: string
  }): Promise<{ url: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudnary.uploader.upload_stream(
        {
          public_id: name,
          folder,
        },
        (error, result) => {
          if (error || !result) {
            reject(error)
          } else {
            const url = cloudnary.url(result.public_id, {
              version: result.version,
              fetch_format: 'auto',
              quality: 'auto',
            })

            resolve({ url })
          }
        },
      )

      const readableStream = new Readable()
      readableStream.push(file.buffer)
      readableStream.push(null)
      readableStream.pipe(uploadStream)
    })
  }
}
