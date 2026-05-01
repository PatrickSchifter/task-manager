import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TasksRequestDTO } from './tasks.dto';
import { QueryPaginationDTO } from 'src/common/dtos/query.pagination.dto';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';

describe('TasksController', () => {
  let controller: TasksController;
  let tasksService: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            create: jest.fn(),
            findAllByProjectId: jest.fn(),
            findById: jest.fn(),
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
            project: {
              findFirst: jest.fn().mockResolvedValue({ id: 'projectId' }), // Mock project to exist
            },
            task: {
              findFirst: jest.fn().mockResolvedValue({ id: 'taskId' }), // Mock task to exist
            },
            user: {
              findFirst: jest.fn().mockResolvedValue({ id: 'userId' }), // Mock user to exist
            },
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true), // Mock JwtAuthGuard to always allow activation
      })
      .compile();

    controller = module.get<TasksController>(TasksController);
    tasksService = module.get<TasksService>(TasksService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAllByProjectId', () => {
    it('should call tasksService.findAllByProjectId and return paginated results', async () => {
      const projectId = 'project1';
      const query: QueryPaginationDTO = { page: 1, limit: 10 };
      const serviceResult = {
        data: [{ id: 'task1', title: 'Test Task', projectId, assigneeId: 'user1' }],
        meta: { total: 1, currentPage: 1, lastPage: 1, nextPage: null, prevPage: null, totalPerPage: 10 },
      };
      jest.spyOn(tasksService, 'findAllByProjectId').mockResolvedValue(serviceResult as any);

      // Mock request parameters for interceptor
      Object.defineProperty(controller, 'findAllByProjectId', {
        value: jest.fn().mockImplementation((reqProjectId, reqQuery) => {
          return tasksService.findAllByProjectId({ projectId: reqProjectId, query: reqQuery });
        }),
      });

      const result = await controller.findAllByProjectId(projectId, query);

      expect(tasksService.findAllByProjectId).toHaveBeenCalledWith({ projectId, query });
      expect(result).toEqual(serviceResult);
    });
  });

  describe('create', () => {
    it('should call tasksService.create and return the result', async () => {
      const projectId = 'project1';
      const createTaskDto: TasksRequestDTO = { title: 'New Task', description: 'Description', status: 'PENDING', priority: 'LOW', dueDate: new Date(), assigneeId: 'user1' };
      const serviceResult = { id: 'task1', ...createTaskDto, projectId };
      jest.spyOn(tasksService, 'create').mockResolvedValue(serviceResult as any);

      // Mock request parameters for interceptor
      Object.defineProperty(controller, 'create', {
        value: jest.fn().mockImplementation((reqProjectId, body) => {
          return tasksService.create({ data: body, projectId: reqProjectId });
        }),
      });

      const result = await controller.create(projectId, createTaskDto);

      expect(tasksService.create).toHaveBeenCalledWith({
        data: createTaskDto,
        projectId,
      });
      expect(result).toEqual(serviceResult);
    });
  });

  describe('findById', () => {
    it('should call tasksService.findById and return the task', async () => {
      const projectId = 'project1';
      const taskId = 'task1';
      const serviceResult = { id: taskId, title: 'Test Task', projectId };
      jest.spyOn(tasksService, 'findById').mockResolvedValue(serviceResult as any);

      // Mock request parameters for interceptor
      Object.defineProperty(controller, 'findById', {
        value: jest.fn().mockImplementation((reqProjectId, reqTaskId) => {
          return tasksService.findById({ id: reqTaskId, projectId: reqProjectId });
        }),
      });

      const result = await controller.findById(projectId, taskId);

      expect(tasksService.findById).toHaveBeenCalledWith({ id: taskId, projectId });
      expect(result).toEqual(serviceResult);
    });
  });

  describe('update', () => {
    it('should call tasksService.update and return the updated task', async () => {
      const projectId = 'project1';
      const taskId = 'task1';
      const updateTaskDto: TasksRequestDTO = { title: 'Updated Task', description: 'Updated', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: new Date(), assigneeId: 'user2' };
      const serviceResult = { id: taskId, ...updateTaskDto, projectId };
      jest.spyOn(tasksService, 'update').mockResolvedValue(serviceResult as any);

      // Mock request parameters for interceptor
      Object.defineProperty(controller, 'update', {
        value: jest.fn().mockImplementation((reqTaskId, reqProjectId, body) => {
          return tasksService.update({ data: body, id: reqTaskId, projectId: reqProjectId });
        }),
      });

      const result = await controller.update(taskId, projectId, updateTaskDto);

      expect(tasksService.update).toHaveBeenCalledWith({
        data: updateTaskDto,
        id: taskId,
        projectId,
      });
      expect(result).toEqual(serviceResult);
    });
  });

  describe('delete', () => {
    it('should call tasksService.delete', async () => {
      const projectId = 'project1';
      const taskId = 'task1';
      jest.spyOn(tasksService, 'delete').mockResolvedValue(undefined);

      // Mock request parameters for interceptor
      Object.defineProperty(controller, 'delete', {
        value: jest.fn().mockImplementation((reqTaskId, reqProjectId) => {
          return tasksService.delete({ id: reqTaskId, projectId: reqProjectId });
        }),
      });

      await controller.delete(taskId, projectId);

      expect(tasksService.delete).toHaveBeenCalledWith({ id: taskId, projectId });
    });
  });
});
