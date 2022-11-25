import { MailchimpExceptionFilter } from './mailchimpError.filter';
import { Test, TestingModule } from '@nestjs/testing';
import { MailchimpException } from '../types/types';

const mockRedirect = jest.fn();
const mockGetResponse = jest.fn().mockImplementation(() => ({
  redirect: mockRedirect,
}));

const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getResponse: mockGetResponse,
  getRequest: jest.fn(),
}));

const mockArgumentsHost = {
  switchToHttp: mockHttpArgumentsHost,
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};

describe('MailchimpErrorFilter', () => {
  let service: MailchimpExceptionFilter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailchimpExceptionFilter],
    }).compile();

    service = module.get<MailchimpExceptionFilter>(MailchimpExceptionFilter);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Email is in use', () => {
    it('should redirect to manage user preferences page', () => {
      const mailchimpException = new MailchimpException({
        status: 400,
        detail:
          'email@email.com is already a list member. Use PUT to insert or update list members.',
        instance: '98b354f0-ee0f-c627-a951-ddbf4963ae08',
        title: 'Member Exists',
        type: '',
      });

      service.catch(mailchimpException, mockArgumentsHost);
      expect(mockRedirect).toBeCalledTimes(1);
      expect(mockRedirect).toBeCalledWith('/subscribe/manage');
    });
  });

  describe('Non-email in use exception', () => {
    it('should redirect to manage page', () => {
      const mailchimpException = new MailchimpException({
        status: 500,
        detail: 'detail',
        instance: '98b354f0-ee0f-c627-a951-ddbf4963ae08',
        title: 'Bad Request',
        type: '',
      });

      service.catch(mailchimpException, mockArgumentsHost);
      expect(mockRedirect).toBeCalledTimes(1);
      expect(mockRedirect).toBeCalledWith('/subscribe');
    });
  });
});
