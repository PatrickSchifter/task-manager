import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppService {
  getHealthCheck(): { message: string } {
    return { message: "API is running!" };
  }
}
