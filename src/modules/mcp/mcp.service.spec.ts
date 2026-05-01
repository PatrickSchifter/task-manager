import { Test, TestingModule } from '@nestjs/testing';
import { McpService } from './mcp.service';
import { Logger } from '@nestjs/common';

describe('McpService', () => {
  let service: McpService;
  let loggerSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [McpService],
    }).compile();

    service = module.get<McpService>(McpService);

    // Spy on the private logger instance's methods
    loggerSpy = jest.spyOn((service as any).logger, 'log').mockImplementation(() => {});

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processRequest', () => {
    it('should log the context and echo back the request', async () => {
      const prompt = 'Hello MCP';
      const context = { userId: 'user1', projectId: 'project1' };
      const expectedResponse = `Received MCP request: "${prompt}" with context: ${JSON.stringify(context)}`;

      const result = await service.processRequest(prompt, context);

      expect(loggerSpy).toHaveBeenCalledWith(`Processing MCP request with context: ${JSON.stringify(context)}`);
      expect(result).toEqual({ response: expectedResponse, actions: [] });
    });

    it('should handle empty context gracefully', async () => {
      const prompt = 'Another request';
      const expectedResponse = `Received MCP request: "${prompt}" with context: {}`;

      const result = await service.processRequest(prompt);

      expect(loggerSpy).toHaveBeenCalledWith(`Processing MCP request with context: {}`);
      expect(result).toEqual({ response: expectedResponse, actions: [] });
    });
  });

  describe('getCapabilities', () => {
    it('should return a predefined list of capabilities', () => {
      const capabilities = service.getCapabilities();

      expect(capabilities).toEqual({
        resources: [
          { name: 'users', description: 'Manage user information' },
          { name: 'projects', description: 'Manage projects and collaborators' },
          { name: 'tasks', description: 'Manage tasks, assignments, and status' },
          { name: 'comments', description: 'Manage task comments' },
        ],
        tools: [
          { name: 'create_task', description: 'Create a new task' },
          { name: 'update_task', description: 'Update task properties' },
          { name: 'assign_task', description: 'Assign task to a user' },
          { name: 'create_project', description: 'Create a new project' },
          { name: 'add_comment', description: 'Add comment to a task' },
          { name: 'get_context', description: 'Get current context information' },
        ],
      });
    });
  });
});
