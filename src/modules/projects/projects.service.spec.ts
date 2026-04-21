import { Test, TestingModule } from '@nestjs/testing'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { Project } from 'src/generated/prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { paginateOutput } from 'src/utils/pagination.utils'
import { mockedProjects, mockPaginationQuery } from './projects.mocks'
import { ProjectsService } from './projects.service'

describe('ProjectsService', () => {
  let service: ProjectsService
  let prisma: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: PrismaService,
          useValue: {
            project: {
              findMany: jest.fn(),
              count: jest.fn(),
              findFirst: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            projectCollaborator: {
              create: jest.fn(),
            },
            task: {
              deleteMany: jest.fn(),
            },
          },
        },
        {
          provide: RequestContextService,
          useValue: {
            getUserId: jest.fn().mockReturnValue('user-1'),
          },
        },
      ],
    }).compile()

    service = module.get<ProjectsService>(ProjectsService)
    prisma = module.get<PrismaService>(PrismaService)
  })

  it('should be able to return paginated list of projects', async () => {
    // criando o mock e especificando o retorno das funções
    jest.spyOn(prisma.project, 'findMany').mockResolvedValue(mockedProjects)
    jest.spyOn(prisma.project, 'count').mockResolvedValue(mockedProjects.length)

    //chamada da função
    const result = await service.findAll(mockPaginationQuery)

    //comparações
    expect(result).toEqual(
      paginateOutput<Project>({
        data: mockedProjects,
        total: mockedProjects.length,
        query: mockPaginationQuery,
      }),
    )

    expect(prisma.project.findMany).toHaveBeenCalledTimes(1)
  })

  it('should be able to return a project by id', async () => {
    const project = mockedProjects[0]
    jest.spyOn(prisma.project, 'findFirst').mockResolvedValue(project)

    const result = await service.findById(project.id)

    expect(result).toEqual(project)
    expect(prisma.project.findFirst).toHaveBeenCalledTimes(1)
  })

  it('should be able to create a project', async () => {
    const project = mockedProjects[0]
    jest.spyOn(prisma.project, 'create').mockResolvedValue(project)

    const result = await service.create({
      description: project.description,
      name: project.name,
    })

    expect(result).toEqual(project)
    expect(prisma.project.create).toHaveBeenCalledTimes(1)
    expect(prisma.projectCollaborator.create).toHaveBeenCalledTimes(1)
  })

  it('should be able to update a project', async () => {
    const project = mockedProjects[0]

    jest.spyOn(prisma.project, 'update').mockResolvedValue(project)

    const result = await service.update(project.id, {
      description: project.description,
      name: project.name,
    })

    expect(result).toEqual(project)
    expect(prisma.project.update).toHaveBeenCalledTimes(1)
  })

  it('should be able to delete a project', async () => {
    const project = { ...mockedProjects[0] }

    jest.spyOn(prisma.project, 'findFirst').mockResolvedValue(project)

    await service.delete(project.id)

    expect(prisma.task.deleteMany).toHaveBeenCalledTimes(1)
    expect(prisma.project.delete).toHaveBeenCalledTimes(1)
  })
})
