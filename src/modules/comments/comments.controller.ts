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
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse } from '@nestjs/swagger'
import { ValidateResourcesIds } from 'src/common/decorators/validate-resources-ids.decorator'
import { ValidateResourcesIdsInterceptor } from 'src/common/interceptors/validate-resources-ids.interceptor'
import { AddCommentDTO, CommentFullDTO, CommentItemListDTO, UpdateCommentDTO } from './comments.dto'
import { CommentsService } from './comments.service'

@Controller({
  version: '1',
  path: 'projects/:projectId/tasks/:taskId/comments',
})
@UseInterceptors(ValidateResourcesIdsInterceptor)
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Post()
  @ApiCreatedResponse({ type: CommentItemListDTO })
  @HttpCode(HttpStatus.CREATED)
  @ValidateResourcesIds()
  create(@Param('taskId', ParseUUIDPipe) taskId: string, @Body() data: AddCommentDTO) {
    return this.commentService.create({
      data,
      taskId,
      authorId: '20fe7367-d3ee-4de5-8143-991d6245994f',
    })
  }

  @Get()
  @ValidateResourcesIds()
  @ApiOkResponse({ type: [CommentItemListDTO] })
  findAllByTaskId(@Param('taksId', ParseUUIDPipe) taskId: string) {
    return this.commentService.findByTaskId(taskId)
  }

  @Get(':commentId')
  @ValidateResourcesIds()
  @ApiOkResponse({ type: CommentFullDTO })
  findById(@Param('commentId', ParseUUIDPipe) id: string) {
    return this.commentService.findById(id)
  }

  @Put(':commentId')
  @ValidateResourcesIds()
  @ApiOkResponse({ type: CommentItemListDTO })
  update(@Param('commentId', ParseUUIDPipe) id: string, @Body() data: UpdateCommentDTO) {
    return this.commentService.update({ data, id })
  }

  @Delete(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ValidateResourcesIds()
  @ApiNoContentResponse()
  delete(@Param('commentId', ParseUUIDPipe) id: string) {
    return this.commentService.delete(id)
  }
}
