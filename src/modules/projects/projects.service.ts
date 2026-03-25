import { Injectable } from '@nestjs/common'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { CollaboratorRole } from 'src/generated/prisma/enums'
import { PrismaService } from 'src/prisma.service'
import { ProjectDTO } from './projects.dto'

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContext: RequestContextService,
  ) {}
  findAll() {
    const userId = this.requestContext.getUserId()
    return this.prisma.project.findMany({ where: { createdById: userId } })
  }

  findById(id: string) {
    const userId = this.requestContext.getUserId()
    return this.prisma.project.findFirst({
      where: { id, createdById: userId },
      select: {
        tasks: {
          select: {
            title: true,
            description: true,
            id: true,
            dueDate: true,
            createdAt: true,
            updatedAt: true,
            priority: true,
            status: true,
          },
        },
        createdAt: true,
        updatedAt: true,
        name: true,
        description: true,
        id: true,
      },
    })
  }

  async create(data: ProjectDTO) {
    const userId = this.requestContext.getUserId()
    const project = await this.prisma.project.create({
      data: { ...data, createdById: userId },
    })

    await this.prisma.projectCollaborator.create({
      data: {
        projectId: project.id,
        userId: project.createdById,
        role: CollaboratorRole.OWNER,
      },
    })

    return project
  }

  update(id: string, data: ProjectDTO) {
    const userId = this.requestContext.getUserId()
    return this.prisma.project.update({ where: { id, createdById: userId }, data })
  }

  async delete(id: string) {
    const userId = this.requestContext.getUserId()
    const project = await this.prisma.project.findFirst({ where: { id } })

    if (project?.createdById === userId)
      await this.prisma.task.deleteMany({ where: { projectId: id } })

    return this.prisma.project.delete({ where: { id, createdById: userId } })
  }
}
