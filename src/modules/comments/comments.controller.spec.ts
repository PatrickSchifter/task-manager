import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { AddCommentDTO, UpdateCommentDTO } from './comments.dto';
import { QueryPaginationDTO } from 'src/common/dtos/query.pagination.dto';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';

describe('CommentsController', () => {
  let controller: CommentsController;
  let commentsService: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: {
            create: jest.fn(),
            findByTaskId: jest.fn(),
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

    controller = module.get<CommentsController>(CommentsController);
    commentsService = module.get<CommentsService>(CommentsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call commentsService.create and return the result', async () => {
      const taskId = 'task1';
      const addCommentDto: AddCommentDTO = { content: 'New Comment' };
      const serviceResult = { id: 'comment1', ...addCommentDto, taskId, authorId: 'user1' };
      jest.spyOn(commentsService, 'create').mockResolvedValue(serviceResult as any);

      // Mock request parameters for interceptor
      Object.defineProperty(controller, 'create', {
        value: jest.fn().mockImplementation((reqTaskId, body) => {
          return commentsService.create({ data: body, taskId: reqTaskId });
        }),
      });

      const result = await controller.create(taskId, addCommentDto);

      expect(commentsService.create).toHaveBeenCalledWith({
        data: addCommentDto,
        taskId,
      });
      expect(result).toEqual(serviceResult);
    });
  });

  describe('findAllByTaskId', () => {
    it('should call commentsService.findByTaskId and return paginated results', async () => {
      const taskId = 'task1';
      const query: QueryPaginationDTO = { page: 1, limit: 10 };
      const serviceResult = {
        data: [{ id: 'comment1', content: 'Test Comment', taskId, authorId: 'user1' }],
        meta: { totalItems: 1, itemCount: 1, itemsPerPage: 10, totalPages: 1, currentPage: 1 },
      };
      jest.spyOn(commentsService, 'findByTaskId').mockResolvedValue(serviceResult as any);

      // Mock request parameters for interceptor
      Object.defineProperty(controller, 'findAllByTaskId', {
        value: jest.fn().mockImplementation((reqTaskId, reqQuery) => {
          return commentsService.findByTaskId({ taskId: reqTaskId, query: reqQuery });
        }),
      });

      const result = await controller.findAllByTaskId(taskId, query);

      expect(commentsService.findByTaskId).toHaveBeenCalledWith({ taskId, query });
      expect(result).toEqual(serviceResult);
    });
  });

  describe('findById', () => {
    it('should call commentsService.findById and return the comment', async () => {
      const commentId = 'comment1';
      const serviceResult = { id: commentId, content: 'Test Comment', taskId: 'task1', authorId: 'user1' };
      jest.spyOn(commentsService, 'findById').mockResolvedValue(serviceResult as any);

      // Mock request parameters for interceptor
      Object.defineProperty(controller, 'findById', {
        value: jest.fn().mockImplementation((reqCommentId) => {
          return commentsService.findById(reqCommentId);
        }),
      });

      const result = await controller.findById(commentId);

      expect(commentsService.findById).toHaveBeenCalledWith(commentId);
      expect(result).toEqual(serviceResult);
    });
  });

  describe('update', () => {
    it('should call commentsService.update and return the updated comment', async () => {
      const commentId = 'comment1';
      const updateCommentDto: UpdateCommentDTO = { content: 'Updated Comment' };
      const serviceResult = { id: commentId, content: 'Updated Comment', taskId: 'task1', authorId: 'user1' };
      jest.spyOn(commentsService, 'update').mockResolvedValue(serviceResult as any);

      // Mock request parameters for interceptor
      Object.defineProperty(controller, 'update', {
        value: jest.fn().mockImplementation((reqCommentId, body) => {
          return commentsService.update({ data: body, id: reqCommentId });
        }),
      });

      const result = await controller.update(commentId, updateCommentDto);

      expect(commentsService.update).toHaveBeenCalledWith({
        data: updateCommentDto,
        id: commentId,
      });
      expect(result).toEqual(serviceResult);
    });
  });

  describe('delete', () => {
    it('should call commentsService.delete', async () => {
      const commentId = 'comment1';
      jest.spyOn(commentsService, 'delete').mockResolvedValue(undefined);

      // Mock request parameters for interceptor
      Object.defineProperty(controller, 'delete', {
        value: jest.fn().mockImplementation((reqCommentId) => {
          return commentsService.delete(reqCommentId);
        }),
      });

      await controller.delete(commentId);

      expect(commentsService.delete).toHaveBeenCalledWith(commentId);
    });
  });
});
