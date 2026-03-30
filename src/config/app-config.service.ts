import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get port(): number {
    return this.configService.getOrThrow<number>("app.port");
  }

  get urlBase(): string {
    return this.configService.getOrThrow<string>("app.url_base");
  }

  get env(): string {
    return this.configService.getOrThrow<string>("app.env");
  }

  get rabbitMqUrl(): string {
    return this.configService.getOrThrow<string>("rmq.url");
  }
}
