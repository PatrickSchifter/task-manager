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
import { ApiCreatedResponse, ApiResponse } from '@nestjs/swagger'
import { ValidateResourcesIds } from 'src/common/decorators/validate-resources-ids.decorator'
import { ValidateResourcesIdsInterceptor } from 'src/common/interceptors/validate-resources-ids.interceptor'
import { ProjectDTO, ProjectFullDTO, ProjectItemListDTO } from './projects.dto'
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
  @ApiResponse({ type: ProjectFullDTO })
  @ValidateResourcesIds()
  findById(@Param('projectId', ParseUUIDPipe) id: string) {
    return this.projectService.findById(id)
  }

  @Post()
  @ApiCreatedResponse({ type: ProjectItemListDTO })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: ProjectDTO) {
    return this.projectService.create(data)
  }

  @Put(':projectId')
  @ApiResponse({ type: ProjectItemListDTO })
  @ValidateResourcesIds()
  update(@Param('projectId', ParseUUIDPipe) id: string, @Body() data: ProjectDTO) {
    return this.projectService.update(id, data)
  }

  @Delete(':projectId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ValidateResourcesIds()
  delete(@Param('projectId', ParseUUIDPipe) id: string) {
    return this.projectService.delete(id)
  }
}
