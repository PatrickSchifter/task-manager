import { Injectable, Inject } from "@nestjs/common";
import { AppConfigService } from "src/config/app-config.service";
import { EMAIL_SERVICE, SEND_PASSWORD_RESET } from "src/consts";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class MailService {
  constructor(
    @Inject(EMAIL_SERVICE) private client: ClientProxy,
    private readonly appConfigService: AppConfigService,
  ) {}

  async sendPasswordRequest(email: string, token: string) {
    const url = `${this.appConfigService.urlBase}/v1/auth/reset-password?token=${token}`;

    this.client.emit(SEND_PASSWORD_RESET, { email, url });
  }
}
