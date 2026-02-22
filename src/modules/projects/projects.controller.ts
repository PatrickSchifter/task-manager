import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common'
import { ProjectRequestDTO } from './projects.dto'
import { ProjectsService } from './projects.service'

@Controller({ path: 'projects', version: '1' })
export class ProjectsController {
  constructor(private readonly projectService: ProjectsService) {}

  @Get()
  findAll() {
    return this.projectService.findAll()
  }

  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectService.findById(id)
  }

  @Post()
  create(@Body() data: ProjectRequestDTO) {
    return this.projectService.create(data)
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() data: ProjectRequestDTO) {
    return this.projectService.update(id, data)
  }

  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectService.delete(id)
  }
}
