import * as path from "node:path";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/adapters/handlebars.adapter";
import { MailService } from "./mail.service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { EMAIL_QUEUE, EMAIL_SERVICE } from "src/consts";
import { MailConsumer } from "./mail.consumer";

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>("SMTP_HOST"),
          port: config.get<number>("SMTP_PORT"),
          secure: false,
          auth: {
            user: config.get<string>("SMTP_USER"),
            pass: config.get<string>("SMTP_PASS"),
          },
        },
        defaults: {
          from: '"Task Manager" <no-reply@solutlabs.com.br>',
        },
        template: {
          dir: path.join(__dirname, "templates"),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: EMAIL_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.getOrThrow<string>("rmq.url")],
            queue: EMAIL_QUEUE,
            queueOptions: { durable: true },
          },
        }),
      },
    ]),
  ],
  exports: [MailService, ClientsModule],
  providers: [MailService],
  controllers: [MailConsumer],
})
export class MailModule {}
