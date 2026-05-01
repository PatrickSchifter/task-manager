import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { EMAIL_SERVICE, SEND_PASSWORD_RESET } from 'src/consts';

describe('MailService', () => {
  let service: MailService;
  let configService: ConfigService;
  let clientProxy: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue('http://localhost:3000'), // Mock base URL
          },
        },
        {
          provide: EMAIL_SERVICE,
          useValue: {
            emit: jest.fn(), // Mock ClientProxy's emit method
          },
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    configService = module.get<ConfigService>(ConfigService);
    clientProxy = module.get<ClientProxy>(EMAIL_SERVICE);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendPasswordRequest', () => {
    it('should send a password reset email message via client.emit', async () => {
      const email = 'test@example.com';
      const token = 'resettoken123';
      const baseUrl = 'http://localhost:3000';
      const expectedUrl = `${baseUrl}/v1/auth/reset-password?token=${token}`;

      await service.sendPasswordRequest(email, token);

      expect(configService.getOrThrow).toHaveBeenCalledWith('app.url_base');
      expect(clientProxy.emit).toHaveBeenCalledWith(SEND_PASSWORD_RESET, { email, url: expectedUrl });
    });
  });
});
