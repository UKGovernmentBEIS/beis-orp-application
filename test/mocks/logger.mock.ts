import { Logger } from '@nestjs/common';

export const mockLogger = {
  provide: Logger,
  useValue: {
    error: jest.fn(),
    log: jest.fn(),
  },
};
