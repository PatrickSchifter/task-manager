import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { RequestContextService } from "./common/services/request-context/request-context.service";
import { AuthModule } from "./modules/auth/auth.module";
import { CollaboratorsModule } from "./modules/collaborators/collaborators.module";
import { CommentsModule } from "./modules/comments/comments.module";
import { ProjectsModule } from "./modules/projects/projects.module";
import { TasksModule } from "./modules/tasks/tasks.module";
import { UsersModule } from "./modules/users/users.module";
import { PrismaService } from "./prisma.service";
import { MailModule } from "./modules/mail/mail.module";
import appConfig from "./config/app.config";
import { AppConfigService } from "./config/app-config.service";
import { AppConfigModule } from "./config/app-config.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    ProjectsModule,
    TasksModule,
    UsersModule,
    CollaboratorsModule,
    CommentsModule,
    AuthModule,
    MailModule,
    AppConfigModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    RequestContextService,
    AppConfigService,
  ],
})
export class AppModule {}
