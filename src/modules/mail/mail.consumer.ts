import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { SEND_PASSWORD_RESET } from 'src/consts'
import { MailService } from './mail.service'

@Controller()
export class MailConsumer {
  constructor(private readonly mailService: MailService) {}

  @EventPattern(SEND_PASSWORD_RESET)
  async handlePasswordReset(@Payload() data: { email: string; url: string }) {
    const { email, url } = data

    await this.mailService.sendPasswordRequestDirect(email, url)
  }
}
