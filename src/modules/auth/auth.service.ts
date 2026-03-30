import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma.service";
import { UsersService } from "../users/users.service";
import { SignInDTO, SignUpDTO } from "./auth.dto";
import { MailService } from "../mail/mail.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly prisma: PrismaService,
  ) {}

  async signup(data: SignUpDTO) {
    const hash = await bcrypt.hash(data.password, 12);

    const newUser = await this.usersService.create({ ...data, password: hash });

    return {
      token: this.jwtService.sign({
        sub: { id: newUser.id },
      }),
    };
  }

  async signin({ email, password }: SignInDTO) {
    const user = await this.usersService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password)))
      return {
        token: this.jwtService.sign({
          sub: user.id,
        }),
      };
    throw new UnauthorizedException();
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) throw new NotFoundException("User not found");

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      purpose: "password-reset",
    });

    await this.mailService.sendPasswordRequest(user.email, token);

    return { message: "Password request mail send" };
  }

  async resetPassword(token: string, newPassword) {
    try {
      const payload = this.jwtService.verify(token);

      if (payload.purpose !== "password-reset")
        throw new BadRequestException("Invalid token");

      const user = await this.usersService.findById(payload.sub);

      if (!user) throw new BadRequestException("Invalid token");

      const hash = await bcrypt.hash(newPassword, 12);

      return this.prisma.user.update({
        data: { password: hash },
        where: { id: user.id },
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException("Invalid or expired token");
    }
  }
}
