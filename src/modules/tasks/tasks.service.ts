import { Injectable } from '@nestjs/common'
import { Prisma } from 'src/generated/prisma/client'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.TaskCreateInput) {
    return this.prisma.task.create({ data })
  }

  findAllByProjectId(projectId: string) {
    return this.prisma.task.findMany({ where: { projectId } })
  }

  findById({ id, projectId }: { id: string; projectId: string }) {
    return this.prisma.task.findFirst({ where: { id, projectId } })
  }

  update({ id, data, projectId }: { id: string; data: Prisma.TaskUpdateInput; projectId: string }) {
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
