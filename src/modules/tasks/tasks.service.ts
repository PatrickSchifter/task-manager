import { Injectable } from '@nestjs/common'
import { PaginatedResponseDTO, QueryPaginationDTO } from 'src/common/dtos/query.pagination.dto'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { Task } from 'src/generated/prisma/client'
import { PrismaService } from 'src/prisma.service'
import { paginate, paginateOutput } from 'src/utils/pagination.utils'
import { TasksDTO } from './tasks.dto'

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContext: RequestContextService,
  ) {}

  create({ data, projectId }: { data: TasksDTO; projectId: string }) {
    const userId = this.requestContext.getUserId()
    return this.prisma.task.create({
      data: {
        ...data,
        assignee: { connect: { id: userId } },
        project: { connect: { id: projectId } },
      },
    })
  }

  async findAllByProjectId({
    projectId,
    query,
  }: {
    projectId: string
    query?: QueryPaginationDTO
  }): Promise<PaginatedResponseDTO<Task>> {
    const { skip, take } = paginate(query)
    const where = { projectId }

    const tasks = await this.prisma.task.findMany({ where, skip, take })
    const total = await this.prisma.task.count({ where })

    return paginateOutput({ data: tasks, total, query })
  }

  findById({ id, projectId }: { id: string; projectId: string }) {
    return this.prisma.task.findFirst({
      where: { id, projectId },
      include: { comments: { select: { id: true, taskId: true, authorId: true, content: true } } },
    })
  }

  update({ id, data, projectId }: { id: string; data: TasksDTO; projectId: string }) {
    return this.prisma.task.update({
      where: {
        id,
        projectId,
      },
      data,
    })
  }

  delete({ id, projectId }: { id: string; projectId: string }) {
    return this.prisma.task.delete({ where: { id, projectId } })
  }
}
