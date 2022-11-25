import { Test, TestingModule } from '@nestjs/testing';
import { SubscribeController } from './subscribe.controller';
import { SubscribeService } from './subscribe.service';
import { subscriber } from './test/mocks';
import * as mailchimp from '@mailchimp/mailchimp_marketing';
import { mockConfigService } from '../../../test/config.mock';

describe('SubscribeController', () => {
  let controller: SubscribeController;
  let subscribeService: SubscribeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscribeController],
      providers: [SubscribeService, mockConfigService],
    }).compile();

    subscribeService = module.get<SubscribeService>(SubscribeService);
    controller = module.get<SubscribeController>(SubscribeController);
  });

  describe('subscribeUser', () => {
    it('should pass subscriber to service', async () => {
      const result = {
        done: true,
      } as undefined as mailchimp.MembersSuccessResponse;
      jest.spyOn(subscribeService, 'subscribeUser').mockResolvedValue(result);

      const session = {};
      const expectedResult = await controller.subscribe(session, subscriber);

      expect(session).toEqual({ emailAddress: subscriber.emailAddress });
      expect(expectedResult).toBe(result);
    });
  });
});
