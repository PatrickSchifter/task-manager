import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class AddCommentDTO {
  @ApiProperty({ description: 'Task comment' })
  @IsNotEmpty()
  @IsString()
  content: string
}

class CommentAuthorDTO {
  @ApiProperty() id: string
  @ApiProperty() name: string
  @ApiProperty() email: string
  @ApiProperty({ nullable: true }) avatar: string
}

export class CommentItemListDTO {
  @ApiProperty() id: string
  @ApiProperty() content: string
  @ApiProperty() taskId: string
  @ApiProperty() authorId: string
  @ApiProperty({ format: 'date-time' }) createAt: string
  @ApiProperty({ format: 'date-time' }) updatedAt: string

  @ApiProperty({ type: CommentAuthorDTO })
  author: CommentAuthorDTO
}

class CommentTaskDTO {
  @ApiProperty() id: string
  @ApiProperty() title: string
  @ApiProperty() projectId: string
}

export class CommentFullDTO extends CommentItemListDTO {
  @ApiProperty({ type: CommentTaskDTO }) task: CommentTaskDTO
}

export class UpdateCommentDTO extends AddCommentDTO {}
