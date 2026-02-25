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
} from '@nestjs/common'
import { TasksDTO } from '../tasks/tasks.dto'
import { TasksService } from './tasks.service'

@Controller({
  version: '1',
  path: 'projects/:projectId/tasks',
})
export class TasksController {
  constructor(private readonly taskService: TasksService) {}
  @Get()
  findAllByProjectId(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.taskService.findAllByProjectId(projectId)
  }

  @Post()
  create(@Param('projectId', ParseUUIDPipe) projectId: string, @Body() data: TasksDTO) {
    return this.taskService.create({ ...data, project: { connect: { id: projectId } } })
  }

  @Get(':taskId')
  findById(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
  ) {
    return this.taskService.findById({ id: taskId, projectId })
  }

  @Put(':taskId')
  update(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() data: TasksDTO,
  ) {
    return this.taskService.update({ data, id: taskId, projectId })
  }

  @Delete(':taskId')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ) {
    return this.taskService.delete({ id: taskId, projectId })
  }
}
