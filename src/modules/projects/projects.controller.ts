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
import { ApiBearerAuth, ApiCreatedResponse, ApiResponse } from '@nestjs/swagger'
import { ValidateResourcesIds } from 'src/common/decorators/validate-resources-ids.decorator'
import { QueryPaginationDTO } from 'src/common/dtos/query.pagination.dto'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard'
import { ValidateResourcesIdsInterceptor } from 'src/common/interceptors/validate-resources-ids.interceptor'
import { ProjectDTO, ProjectFullDTO, ProjectItemListDTO } from './projects.dto'
import { ProjectsService } from './projects.service'

@Controller({ path: 'projects', version: '1' })
@UseInterceptors(ValidateResourcesIdsInterceptor)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class ProjectsController {
  constructor(private readonly projectService: ProjectsService) {}

  @Get()
  @ApiResponse({ type: [ProjectItemListDTO] })
  findAll(@Query() query?: QueryPaginationDTO) {
    return this.projectService.findAll(query)
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
