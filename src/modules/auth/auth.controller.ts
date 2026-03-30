import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiCreatedResponse } from "@nestjs/swagger";
import { AuthenticatedUser } from "src/common/decorators/authenticated-user.decorator";
import type { User } from "src/generated/prisma/client";
import { UserItemListDTO } from "../users/users.dto";
import {
  ForgotPasswordDTO,
  ResetPasswordDTO,
  SignInDTO,
  SignUpDTO,
} from "./auth.dto";
import { AuthService } from "./auth.service";

@Controller({ path: "auth", version: "1" })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  @ApiCreatedResponse({ type: UserItemListDTO })
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() data: SignUpDTO) {
    return this.authService.signup(data);
  }

  @Post("signin")
  @HttpCode(HttpStatus.OK)
  signin(@Body() data: SignInDTO) {
    return this.authService.signin(data);
  }

  @Get("protected")
  @UseGuards(AuthGuard("jwt"))
  protected(@AuthenticatedUser() user: User) {
    return { message: "Authenticated", user };
  }

  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() data: ForgotPasswordDTO) {
    return this.authService.forgotPassword(data.email);
  }

  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() data: ResetPasswordDTO) {
    return this.authService.resetPassword(data.token, data.newPassword);
  }
}
