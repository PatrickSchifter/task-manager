import { Injectable, NotFoundException } from '@nestjs/common'
import { PaginatedResponseDTO, QueryPaginationDTO } from 'src/common/dtos/query.pagination.dto'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { Comment } from 'src/generated/prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { paginate, paginateOutput } from 'src/utils/pagination.utils'
import { AddCommentDTO, UpdateCommentDTO } from './comments.dto'

const authorAttributes = {
  select: {
    id: true,
    name: true,
    email: true,
    avatar: true,
  },
}

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContext: RequestContextService,
  ) {}

  create({ data, taskId }: { data: AddCommentDTO; taskId: string }) {
    const userId = this.requestContext.getUserId()
    return this.prisma.comment.create({
      data: {
        ...data,
        task: { connect: { id: taskId } },
        author: { connect: { id: userId } },
      },
      include: { author: authorAttributes },
    })
  }

  findById(taskId: string) {
    return this.prisma.comment.findFirst({
      where: {
        taskId,
      },
      include: {
        author: authorAttributes,
        task: { select: { id: true, title: true, projectId: true } },
      },
    })
  }

  async findByTaskId({
    taskId,
    query,
  }: {
    taskId: string
    query?: QueryPaginationDTO
  }): Promise<PaginatedResponseDTO<Comment>> {
    const { skip, take } = paginate(query)
    const where = { taskId }

    const total = await this.prisma.comment.count({ where })

    const comments = await this.prisma.comment.findMany({
      where,
      skip,
      take,
      include: { author: authorAttributes },
    })

    return paginateOutput({ data: comments, total, query })
  }

  findByAuthorId(authorId: string) {
    return this.prisma.comment.findMany({
      where: {
        authorId,
      },
      include: { author: authorAttributes },
    })
  }

  async update({ data, id }: { data: UpdateCommentDTO; id: string }) {
    const userId = this.requestContext.getUserId()
    const comment = await this.prisma.comment.findFirst({ where: { id } })
    if (!comment) throw new NotFoundException('Comment not found')
    return this.prisma.comment.update({
      where: {
        id,
        authorId: userId,
      },
      data,
      include: { author: authorAttributes },
    })
  }

  async delete(id: string) {
    const userId = this.requestContext.getUserId()
    const comment = await this.prisma.comment.findFirst({ where: { id, authorId: userId } })

    if (!comment) throw new NotFoundException('Comment not found')

    await this.prisma.comment.delete({ where: { id, authorId: userId } })
    return
  }
}
