import { Module } from '@nestjs/common'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { ProjectsController } from './projects.controller'
import { ProjectsService } from './projects.service'

@Module({
  providers: [ProjectsService, RequestContextService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
