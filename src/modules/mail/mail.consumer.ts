import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { SEND_PASSWORD_RESET } from "src/consts";
import { MailerService } from "@nestjs-modules/mailer";

@Controller()
export class MailConsumer {
  constructor(private mailer: MailerService) {}

  @EventPattern(SEND_PASSWORD_RESET)
  async handlePasswordReset(@Payload() data: { email: string; url: string }) {
    await this.mailer.sendMail({
      to: data.email,
      subject: "Password reset",
      template: "forgot-password.hbs",
      context: { url: data.url },
    });
  }
}
