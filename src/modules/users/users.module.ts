import { Module } from '@nestjs/common'
import { CloudnaryService } from 'src/common/services/cloudnary/cloudnary.service'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  controllers: [UsersController],
  providers: [UsersService, RequestContextService, CloudnaryService],
  exports: [UsersService],
})
export class UsersModule {}
