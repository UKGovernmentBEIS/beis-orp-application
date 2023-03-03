import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorisedController } from './unauthorised.controller';
import { mockLogger } from '../../../test/mocks/logger.mock';

describe('UnauthorisedController', () => {
  let controller: UnauthorisedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnauthorisedController],
      providers: [mockLogger],
    }).compile();

    controller = module.get<UnauthorisedController>(UnauthorisedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
