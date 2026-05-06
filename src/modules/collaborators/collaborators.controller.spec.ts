import { Test, TestingModule } from '@nestjs/testing'
import { CollaboratorsController } from './collaborators.controller'
import { CollaboratorsService } from './collaborators.service'
import { mockedCollaborators, mockPaginationQuery } from './collaborators.mocks'
import { PaginatedResponseDTO } from 'src/common/dtos/query.pagination.dto'

describe('CollaboratorsController', () => {
  let controller: CollaboratorsController
  let service: CollaboratorsService

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
      ],
    }).compile()

    controller = module.get<CollaboratorsController>(CollaboratorsController)
    service = module.get<CollaboratorsService>(CollaboratorsService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should return paginated list of collaborators', async () => {
    const result: PaginatedResponseDTO<any> = {
      data: mockedCollaborators,
      total: mockedCollaborators.length,
      limit: 10,
      page: 1,
      totalPages: 1,
    }
    jest.spyOn(service, 'findAllByProject').mockResolvedValue(result)

    const response = await controller.findAllByProject('project-1', { limit: '10', page: '1' })

    expect(response).toEqual(result)
    expect(service.findAllByProject).toHaveBeenCalledWith('project-1', { limit: '10', page: '1' })
  })

  it('should create a collaborator', async () => {
    const collaborator = mockedCollaborators[0]
    jest.spyOn(service, 'create').mockResolvedValue(collaborator)

    const response = await controller.create('project-1', { userId: 'user-1', role: 'EDITOR' })

    expect(response).toEqual(collaborator)
    expect(service.create).toHaveBeenCalledWith('project-1', { userId: 'user-1', role: 'EDITOR' })
  })

  it('should update a collaborator', async () => {
    const collaborator = mockedCollaborators[0]
    jest.spyOn(service, 'update').mockResolvedValue(collaborator)

    const response = await controller.update('project-1', 'user-1', { role: 'VIEWER' })

    expect(response).toEqual(collaborator)
    expect(service.update).toHaveBeenCalledWith('project-1', 'user-1', { role: 'VIEWER' })
  })

  it('should delete a collaborator', async () => {
    const collaborator = mockedCollaborators[0]
    jest.spyOn(service, 'delete').mockResolvedValue(collaborator)

    const response = await controller.delete('project-1', 'user-1')

    expect(response).toEqual(collaborator)
    expect(service.delete).toHaveBeenCalledWith('project-1', 'user-1')
  })
})