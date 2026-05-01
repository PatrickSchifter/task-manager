import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CloudnaryService } from 'src/common/services/cloudnary/cloudnary.service';
import { RequestContextService } from 'src/common/services/request-context/request-context.service';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { QueryPaginationDTO } from 'src/common/dtos/query.pagination.dto';
import { UpdateUsersDTO, UsersDTO } from './users.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;
  let cloudnaryService: CloudnaryService;
  let requestContextService: RequestContextService;

  const mockUser = {
    id: 'user1',
    name: 'Test User',
    email: 'test@example.com',
    avatar: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: CloudnaryService,
          useValue: {
            upload: jest.fn(),
          },
        },
        {
          provide: RequestContextService,
          useValue: {
            getUser: jest.fn().mockReturnValue(mockUser),
            getUserId: jest.fn().mockReturnValue(mockUser.id),
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

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    cloudnaryService = module.get<CloudnaryService>(CloudnaryService);
    requestContextService = module.get<RequestContextService>(RequestContextService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call usersService.findAll and return paginated users', async () => {
      const query: QueryPaginationDTO = { page: 1, limit: 10 };
      const serviceResult = {
        data: [mockUser],
        meta: { total: 1, currentPage: 1, lastPage: 1, nextPage: null, prevPage: null, totalPerPage: 10 },
      };
      jest.spyOn(usersService, 'findAll').mockResolvedValue(serviceResult as any);

      const result = await controller.findAll(query);

      expect(usersService.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(serviceResult);
    });
  });

  describe('create', () => {
    it('should call usersService.create and return the new user', async () => {
      const createDto: UsersDTO = { name: 'New User', email: 'new@example.com', password: 'password123' };
      const serviceResult = { id: 'new-user-id', ...createDto, password: undefined };
      jest.spyOn(usersService, 'create').mockResolvedValue(serviceResult as any);

      const result = await controller.create(createDto);

      expect(usersService.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(serviceResult);
    });
  });

  describe('findById', () => {
    it('should call usersService.findById and return the user', async () => {
      const id = 'user1';
      jest.spyOn(usersService, 'findById').mockResolvedValue(mockUser as any);

      const result = await controller.findById(id);

      expect(usersService.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should call usersService.update and return the updated user', async () => {
      const id = 'user1';
      const updateDto: UpdateUsersDTO = { name: 'Updated User' };
      const serviceResult = { ...mockUser, name: 'Updated User' };
      jest.spyOn(usersService, 'update').mockResolvedValue(serviceResult as any);

      const result = await controller.update(id, updateDto);

      expect(usersService.update).toHaveBeenCalledWith({ data: updateDto, id });
      expect(result).toEqual(serviceResult);
    });
  });

  describe('delete', () => {
    it('should call usersService.delete', async () => {
      const id = 'user1';
      jest.spyOn(usersService, 'delete').mockResolvedValue(mockUser as any);

      const result = await controller.delete(id);

      expect(usersService.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockUser);
    });
  });

  describe('uploadAvatar', () => {
    it("should upload avatar and update user's avatar URL", async () => {
      const file: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'avatar.png',
        encoding: '7bit',
        mimetype: 'image/png',
        size: 1024,
        buffer: Buffer.from('file content'),
      };
      const uploadResult = { public_id: 'avatar_id', url: 'http://cloudinary.com/avatar.png' };
      const updatedUser = { ...mockUser, avatar: uploadResult.url };

      jest.spyOn(cloudnaryService, 'upload').mockResolvedValue(uploadResult);
      jest.spyOn(usersService, 'update').mockResolvedValue(updatedUser as any);
      jest.spyOn(usersService, 'findById').mockResolvedValue(updatedUser as any);
      jest.spyOn(requestContextService, 'getUser').mockReturnValue(mockUser);

      const result = await controller.uploadAvatar(file);

      expect(requestContextService.getUser).toHaveBeenCalled();
      expect(cloudnaryService.upload).toHaveBeenCalledWith({
        file,
        folder: 'avatars',
        name: mockUser.id,
      });
      expect(usersService.update).toHaveBeenCalledWith({ data: { avatar: uploadResult.url }, id: mockUser.id });
      expect(usersService.findById).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(updatedUser);
    });
  });
});
