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
import { ApiCreatedResponse, ApiNoContentResponse, ApiResponse } from '@nestjs/swagger'
import { ValidateResourcesIds } from 'src/common/decorators/validate-resources-ids.decorator'
import { ValidateResourcesIdsInterceptor } from 'src/common/interceptors/validate-resources-ids.interceptor'
import {
  AddCollaboratorDTO,
  CollaboratorListItemDTO,
  UpdateCollaboratorDTO,
} from './collaborator.dto'
import { CollaboratorsService } from './collaborators.service'

@Controller({
  version: '1',
  path: 'projects/:projectId/collaborators',
})
@UseInterceptors(ValidateResourcesIdsInterceptor)
export class CollaboratorsController {
  constructor(private readonly collaboratorsService: CollaboratorsService) {}

  @Get()
  @ValidateResourcesIds()
  @ApiResponse({ type: [CollaboratorListItemDTO] })
  findAllByProject(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.collaboratorsService.findAllByProject(projectId)
  }

  @Post()
  @ValidateResourcesIds()
  @ApiCreatedResponse({ type: CollaboratorListItemDTO })
  @HttpCode(HttpStatus.CREATED)
  create(@Param('projectId', ParseUUIDPipe) projectId: string, @Body() data: AddCollaboratorDTO) {
    return this.collaboratorsService.create({ data, projectId })
  }

  @Put(':userId')
  @ValidateResourcesIds()
  @ApiResponse({ type: CollaboratorListItemDTO })
  update(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() data: UpdateCollaboratorDTO,
  ) {
    return this.collaboratorsService.update({ data, projectId, userId })
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ValidateResourcesIds()
  @ApiNoContentResponse()
  delete(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ) {
    return this.collaboratorsService.delete({ projectId, userId })
  }
}
