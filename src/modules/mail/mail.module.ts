import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { EMAIL_QUEUE, EMAIL_SERVICE } from 'src/consts'
import { MailConsumer } from './mail.consumer'
import { MailService } from './mail.service'

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: EMAIL_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.getOrThrow<string>('rmq.url')],
            queue: EMAIL_QUEUE,
            queueOptions: { durable: true },
          },
        }),
      },
    ]),
  ],
  providers: [MailService],
  controllers: [MailConsumer],
  exports: [MailService],
})
export class MailModule {}
