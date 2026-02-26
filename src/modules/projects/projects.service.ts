import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProjectDTO } from './projects.dto'

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}
  findAll() {
    return this.prisma.project.findMany()
  }

  findById(id: string) {
    return this.prisma.project.findFirst({
      where: { id },
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

  create(data: ProjectDTO) {
    return this.prisma.project.create({ data })
  }

  update(id: string, data: ProjectDTO) {
    return this.prisma.project.update({ where: { id }, data })
  }

  async delete(id: string) {
    await this.prisma.task.deleteMany({ where: { projectId: id } })
    return this.prisma.project.delete({ where: { id } })
  }
}
