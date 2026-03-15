import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CollaboratorRole } from 'src/generated/prisma/enums'
import { PrismaService } from 'src/prisma.service'
import { AddCollaboratorDTO, UpdateCollaboratorDTO } from './collaborator.dto'

const userAttributes = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
    },
  },
}

@Injectable()
export class CollaboratorsService {
  constructor(private readonly prisma: PrismaService) {}

  findAllByProject(projectId: string) {
    return this.prisma.projectCollaborator.findMany({
      where: { projectId },
      include: userAttributes,
    })
  }

  async create({ data, projectId }: { projectId: string; data: AddCollaboratorDTO }) {
    const user = await this.prisma.user.findUnique({ where: { id: data.userId } })

    if (!user) throw new NotFoundException('User specified not found')

    return this.prisma.projectCollaborator.create({
      data: { ...data, projectId },
      include: userAttributes,
    })
  }

  async update({
    data,
    projectId,
    userId,
  }: {
    projectId: string
    userId: string
    data: UpdateCollaboratorDTO
  }) {
    const collaborator = await this.prisma.projectCollaborator.findUnique({
      where: {
        userId_projectId: {
          projectId,
          userId,
        },
      },
    })

    if (!collaborator) throw new NotFoundException('Collaborator not found in this project')

    return this.prisma.projectCollaborator.update({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
      data,
      include: userAttributes,
    })
  }

  async delete({ userId, projectId }: { userId: string; projectId: string }) {
    const collaborator = await this.prisma.projectCollaborator.findUnique({
      where: {
        userId_projectId: {
          projectId,
          userId,
        },
      },
    })

    if (!collaborator) throw new NotFoundException('Collaborator not found in this project')

    if (collaborator.role === CollaboratorRole.OWNER)
      throw new BadRequestException('Owner`s can`t be deleted')

    return this.prisma.projectCollaborator.delete({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    })
  }
}
