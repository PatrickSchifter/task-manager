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
    return this.prisma.project.findFirst({ where: { id } })
  }

  create(data: ProjectDTO) {
    return this.prisma.project.create({ data })
  }

  update(id: string, data: ProjectDTO) {
    return this.prisma.project.update({ where: { id }, data })
  }

  delete(id: string) {
    return this.prisma.project.delete({ where: { id } })
  }
}
