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
import { ApiResponse } from '@nestjs/swagger'
import { ProjectItemListDTO, ProjectRequestDTO } from './projects.dto'
import { ProjectsService } from './projects.service'

@Controller({ path: 'projects', version: '1' })
export class ProjectsController {
  constructor(private readonly projectService: ProjectsService) {}

  @Get()
  @ApiResponse({ type: [ProjectItemListDTO] })
  findAll() {
    return this.projectService.findAll()
  }

  @Get(':id')
  @ApiResponse({ type: ProjectItemListDTO })
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectService.findById(id)
  }

  @Post()
  @ApiResponse({ type: ProjectItemListDTO })
  create(@Body() data: ProjectRequestDTO) {
    return this.projectService.create(data)
  }

  @Put(':id')
  @ApiResponse({ type: ProjectItemListDTO })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() data: ProjectRequestDTO) {
    return this.projectService.update(id, data)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectService.delete(id)
  }
}
