import { Reflector } from '@nestjs/core'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from 'src/prisma/prisma.service'
import { CollaboratorsController } from './collaborators.controller'
import { CollaboratorsService } from './collaborators.service'

describe('CollaboratorsController', () => {
  let controller: CollaboratorsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollaboratorsController],
      providers: [
        {
          provide: CollaboratorsService,
          useValue: {
            findAllByProject: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: Reflector,
          useValue: {
            get: jest.fn().mockReturnValue(true), // Mock the Reflector to return true for @ValidateResourcesIds
          },
        },
        {
          provide: PrismaService,
          useValue: {
            projectCollaborator: {
              findMany: jest.fn(),
              count: jest.fn(),
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            user: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile()

    controller = module.get<CollaboratorsController>(CollaboratorsController)
    service = module.get<CollaboratorsService>(CollaboratorsService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
