import { Injectable } from '@nestjs/common'
import { Prisma } from 'src/generated/prisma/client'
import { PrismaService } from 'src/prisma.service'
import { UpdateUsersDTO } from './users.dto'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
      omit: { password: true },
    })
  }

  findById(id: string) {
    return this.prisma.user.findFirst({
      where: { id },
      omit: { password: true },
      include: { createProjects: { select: { id: true, name: true, description: true } } },
    })
  }

  findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email },
    })
  }

  findAll() {
    return this.prisma.user.findMany({ omit: { password: true } })
  }

  update({ data, id }: { id: string; data: UpdateUsersDTO }) {
    return this.prisma.user.update({ where: { id }, data, omit: { password: true } })
  }

  delete(id: string) {
    return this.prisma.user.delete({ where: { id }, omit: { password: true } })
  }
}
