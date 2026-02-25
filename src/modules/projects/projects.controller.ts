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
import { ProjectItemListDTO, ProjectRequestDTO } from './projects.dto'
import { ProjectsService } from './projects.service'

@Controller({ path: 'projects', version: '1' })
@UseInterceptors(ValidateResourcesIdsInterceptor)
export class ProjectsController {
  constructor(private readonly projectService: ProjectsService) {}

  @Get()
  @ApiResponse({ type: [ProjectItemListDTO] })
  findAll() {
    return this.projectService.findAll()
  }

  @Get(':projectId')
  @ApiResponse({ type: ProjectItemListDTO })
  @ValidateResourcesIds()
  async findById(@Param('projectId', ParseUUIDPipe) id: string) {
    return this.projectService.findById(id)
  }

  @Post()
  @ApiResponse({ type: ProjectItemListDTO })
  create(@Body() data: ProjectRequestDTO) {
    return this.projectService.create(data)
  }

  @Put(':projectId')
  @ApiResponse({ type: ProjectItemListDTO })
  @ValidateResourcesIds()
  async update(@Param('projectId', ParseUUIDPipe) id: string, @Body() data: ProjectRequestDTO) {
    return this.projectService.update(id, data)
  }

  @Delete(':projectId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ValidateResourcesIds()
  async delete(@Param('projectId', ParseUUIDPipe) id: string) {
    return this.projectService.delete(id)
  }
}
