import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiResponse,
} from '@nestjs/swagger'
import { ValidateResourcesIds } from 'src/common/decorators/validate-resources-ids.decorator'
import { QueryPaginationDTO } from 'src/common/dtos/query.pagination.dto'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard'
import { ValidateResourcesIdsInterceptor } from 'src/common/interceptors/validate-resources-ids.interceptor'
import { ApiPaginatedResponse } from 'src/common/swagger/api-paginated-response'
import { TaskItemListDTO, TasksDTO } from '../tasks/tasks.dto'
import { TasksService } from './tasks.service'

@UseInterceptors(ValidateResourcesIdsInterceptor)
@Controller({
  version: '1',
  path: 'projects/:projectId/tasks',
})
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  @ApiPaginatedResponse(TaskItemListDTO)
  @ValidateResourcesIds()
  findAllByProjectId(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Query() query?: QueryPaginationDTO,
  ) {
    return this.taskService.findAllByProjectId({ projectId, query })
  }

  @Post()
  @ApiCreatedResponse({ type: TaskItemListDTO })
  @HttpCode(HttpStatus.CREATED)
  @ValidateResourcesIds()
  create(@Param('projectId', ParseUUIDPipe) projectId: string, @Body() data: TasksDTO) {
    return this.taskService.create({
      data,
      projectId,
    })
  }

  @Get(':taskId')
  @ApiResponse({ type: TaskItemListDTO })
  @ValidateResourcesIds()
  findById(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
  ) {
    return this.taskService.findById({ id: taskId, projectId })
  }

  @Put(':taskId')
  @ApiResponse({ type: TaskItemListDTO })
  @ValidateResourcesIds()
  update(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() data: TasksDTO,
  ) {
    return this.taskService.update({ data, id: taskId, projectId })
  }

  @Delete(':taskId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ValidateResourcesIds()
  delete(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ) {
    return this.taskService.delete({ id: taskId, projectId })
  }
}
