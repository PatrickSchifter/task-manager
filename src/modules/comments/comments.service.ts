import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from 'src/generated/prisma/client'
import { PrismaService } from 'src/prisma.service'

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
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.CommentCreateInput) {
    return this.prisma.comment.create({
      data,
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

  findByTaskId(taskId: string) {
    return this.prisma.comment.findMany({
      where: {
        taskId,
      },
      include: { author: authorAttributes },
    })
  }

  findByAuthorId(authorId: string) {
    return this.prisma.comment.findMany({
      where: {
        authorId,
      },
      include: { author: authorAttributes },
    })
  }

  async update({ data, id }: { data: Prisma.CommentUpdateInput; id: string }) {
    const comment = await this.prisma.comment.findFirst({ where: { id } })
    if (!comment) throw new NotFoundException('Comment not found')
    return this.prisma.comment.update({
      where: {
        id,
      },
      data,
      include: { author: authorAttributes },
    })
  }

  async delete(id: string) {
    const comment = await this.prisma.comment.findFirst({ where: { id } })
    if (!comment) throw new NotFoundException('Comment not found')
    await this.prisma.comment.delete({ where: { id } })
    return
  }
}
