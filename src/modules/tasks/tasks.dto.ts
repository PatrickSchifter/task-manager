import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { TaskPriority, TaskStatus } from 'src/generated/prisma/enums'

export class TasksDTO {
  @ApiProperty({ description: 'Task title' })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ description: 'Task description' })
  @IsString()
  @IsOptional()
  desription: string

  @ApiProperty({
    description: 'Task status',
    enum: TaskStatus,
    default: TaskStatus.TODO,
    required: false,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus

  @ApiProperty({
    description: 'Task priority',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
    required: false,
  })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority

  @ApiProperty({ description: 'Task due date' })
  @IsDateString()
  @IsOptional()
  duoDate?: string
}

export class TaskItemListDTO {
  @ApiProperty() id: string
  @ApiProperty() title: string
  @ApiProperty() description: string
  @ApiProperty({ enum: TaskStatus }) status: TaskStatus
  @ApiProperty({ enum: TaskPriority }) priority: TaskPriority
  @ApiProperty({ format: 'date-time' }) dueDate: string
  @ApiProperty() projectId: string
  @ApiProperty({ format: 'date-time' }) createdAt: string
  @ApiProperty({ format: 'date-time' }) updatedAt: string
}
