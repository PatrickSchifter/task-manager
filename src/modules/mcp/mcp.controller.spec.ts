import { Test, TestingModule } from '@nestjs/testing';
import { McpController } from './mcp.controller';
import { McpService } from './mcp.service';

describe('McpController', () => {
  let controller: McpController;
  let service: McpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [McpController],
      providers: [
        {
          provide: McpService,
          useValue: {
            processRequest: jest.fn().mockResolvedValue({
              response: 'Test response',
              actions: [],
            }),
            getCapabilities: jest.fn().mockReturnValue({
              resources: [],
              tools: [],
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<McpController>(McpController);
    service = module.get<McpService>(McpService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should process a request', async () => {
    const result = await controller.processRequest(
      { prompt: 'test prompt' },
      { user: { id: 'test-user-id' } },
    );
    expect(result).toEqual({
      response: 'Test response',
      actions: [],
    });
    expect(service.processRequest).toHaveBeenCalledWith(
      'test prompt',
      { userId: 'test-user-id' },
    );
  });

  it('should get capabilities', () => {
    const result = controller.getCapabilities();
    expect(service.getCapabilities).toHaveBeenCalled();
    expect(result).toEqual({
      resources: [],
      tools: [],
    });
  });
});