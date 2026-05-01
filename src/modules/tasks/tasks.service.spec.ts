import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TasksRequestDTO } from './tasks.dto';
import { QueryPaginationDTO } from 'src/common/dtos/query.pagination.dto';

describe('TasksService', () => {
  let service: TasksService;
  let prismaService: PrismaService;

  const mockTask = {
    id: 'task1',
    title: 'Test Task',
    description: 'Task description',
    status: 'PENDING',
    priority: 'MEDIUM',
    dueDate: new Date(),
    projectId: 'project1',
    assigneeId: 'user1',
    createdAt: new Date(),
    updatedAt: new Date(),
    assignee: { id: 'user1', name: 'User One', email: 'user1@example.com', avatar: null },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: {
            task: {
              create: jest.fn().mockResolvedValue(mockTask),
              findMany: jest.fn().mockResolvedValue([mockTask]),
              count: jest.fn().mockResolvedValue(1),
              findFirst: jest.fn().mockResolvedValue(mockTask),
              update: jest.fn().mockResolvedValue(mockTask),
              delete: jest.fn().mockResolvedValue(undefined),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto: TasksRequestDTO = {
        title: 'New Task',
        description: 'New task description',
        status: 'PENDING',
        priority: 'HIGH',
        dueDate: new Date(),
        assigneeId: 'user1',
      };
      const projectId = 'project1';

      const expectedTask = { ...mockTask, ...createTaskDto, projectId };
      jest.spyOn(prismaService.task, 'create').mockResolvedValue(expectedTask as any);

      const result = await service.create({ data: createTaskDto, projectId });

      expect(prismaService.task.create).toHaveBeenCalledWith({
        data: {
          ...createTaskDto,
          projectId,
        },
        include: { assignee: { select: { id: true, name: true, email: true, avatar: true } } },
      });
      expect(result).toEqual(expectedTask);
    });
  });

  describe('findAllByProjectId', () => {
    it('should return paginated tasks for a given project ID', async () => {
      const projectId = 'project1';
      const query: QueryPaginationDTO = { page: 1, limit: 10 };
      const paginatedResult = {
        data: [mockTask],
        meta: {
          total: 1,
          currentPage: 1,
          lastPage: 1,
          nextPage: null,
          prevPage: null,
          totalPerPage: 10,
        },
      };

      jest.spyOn(prismaService.task, 'count').mockResolvedValue(1);
      jest.spyOn(prismaService.task, 'findMany').mockResolvedValue([mockTask] as any);

      const result = await service.findAllByProjectId({ projectId, query });

      expect(prismaService.task.count).toHaveBeenCalledWith({ where: { projectId } });
      expect(prismaService.task.findMany).toHaveBeenCalledWith({
        where: { projectId },
        skip: 0,
        take: 10,
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          dueDate: true,
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(result.data).toEqual(paginatedResult.data);
      expect(result.meta.total).toEqual(paginatedResult.meta.total);
      expect(result.meta.totalPerPage).toEqual(paginatedResult.meta.totalPerPage);
    });
  });

  describe('findById', () => {
    it('should return a task by ID and project ID', async () => {
      const id = 'task1';
      const projectId = 'project1';
      jest.spyOn(prismaService.task, 'findFirst').mockResolvedValue(mockTask as any);

      const result = await service.findById({ id, projectId });

      expect(prismaService.task.findFirst).toHaveBeenCalledWith({
        where: { id, projectId },
        include: {
          assignee: { select: { id: true, name: true, email: true, avatar: true } },
          comments: {
            include: { author: { select: { id: true, name: true, email: true, avatar: true } } },
          },
        },
      });
      expect(result).toEqual(mockTask);
    });
  });

  describe('update', () => {
    it('should update an existing task', async () => {
      const id = 'task1';
      const projectId = 'project1';
      const updateTaskDto: TasksRequestDTO = {
        title: 'Updated Task',
        description: 'Updated description',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        dueDate: new Date(),
        assigneeId: 'user2',
      };
      const updatedTask = { ...mockTask, ...updateTaskDto };

      jest.spyOn(prismaService.task, 'update').mockResolvedValue(updatedTask as any);

      const result = await service.update({ id, data: updateTaskDto, projectId });

      expect(prismaService.task.update).toHaveBeenCalledWith({
        where: {
          id,
          projectId,
        },
        data: updateTaskDto,
        include: { assignee: { select: { id: true, name: true, email: true, avatar: true } } },
      });
      expect(result).toEqual(updatedTask);
    });
  });

  describe('delete', () => {
    it('should delete a task', async () => {
      const id = 'task1';
      const projectId = 'project1';

      jest.spyOn(prismaService.task, 'delete').mockResolvedValue(undefined);

      await service.delete({ id, projectId });

      expect(prismaService.task.delete).toHaveBeenCalledWith({
        where: { id, projectId },
      });
    });
  });
});
