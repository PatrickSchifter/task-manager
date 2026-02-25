import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
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
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    const project = await this.projectService.findById(id)

    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND)
    }

    return project
  }

  @Post()
  @ApiResponse({ type: ProjectItemListDTO })
  create(@Body() data: ProjectRequestDTO) {
    return this.projectService.create(data)
  }

  @Put(':id')
  @ApiResponse({ type: ProjectItemListDTO })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() data: ProjectRequestDTO) {
    const projectExists = await this.projectService.findById(id)

    if (!projectExists) throw new HttpException('Project not found', HttpStatus.NOT_FOUND)

    return this.projectService.update(id, data)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    const projectExists = await this.projectService.findById(id)

    if (!projectExists) throw new HttpException('Project not found', HttpStatus.NOT_FOUND)

    return this.projectService.delete(id)
  }
}
