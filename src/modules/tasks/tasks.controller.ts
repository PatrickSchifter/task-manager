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
  UseInterceptors,
} from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { ValidateResourcesIds } from 'src/common/decorators/validate-resources-ids.decorator'
import { ValidateResourcesIdsInterceptor } from 'src/common/interceptors/validate-resources-ids.interceptor'
import { TaskItemListDTO, TasksDTO } from '../tasks/tasks.dto'
import { TasksService } from './tasks.service'

@UseInterceptors(ValidateResourcesIdsInterceptor)
@Controller({
  version: '1',
  path: 'projects/:projectId/tasks',
})
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  @ApiResponse({ type: [TaskItemListDTO] })
  @ValidateResourcesIds()
  findAllByProjectId(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.taskService.findAllByProjectId(projectId)
  }

  @Post()
  @ApiResponse({ type: TaskItemListDTO })
  @ValidateResourcesIds()
  create(@Param('projectId', ParseUUIDPipe) projectId: string, @Body() data: TasksDTO) {
    return this.taskService.create({ ...data, project: { connect: { id: projectId } } })
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
  @ValidateResourcesIds()
  delete(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ) {
    return this.taskService.delete({ id: taskId, projectId })
  }
}
