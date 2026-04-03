import { Injectable, Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxy } from '@nestjs/microservices'
import { EMAIL_SERVICE, SEND_PASSWORD_RESET } from 'src/consts'

@Injectable()
export class MailService {
  constructor(
    @Inject(EMAIL_SERVICE) private client: ClientProxy,
    private configService: ConfigService,
  ) {}

  async sendPasswordRequest(email: string, token: string) {
    const url_base = this.configService.getOrThrow<string>('app.url_base')
    const url = `${url_base}/v1/auth/reset-password?token=${token}`

    this.client.emit(SEND_PASSWORD_RESET, { email, url })
  }
}
