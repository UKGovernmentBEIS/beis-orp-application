import { Test, TestingModule } from '@nestjs/testing';
import { SubscribeService } from './subscribe.service';
import { lists, MembersSuccessResponse } from '@mailchimp/mailchimp_marketing';
import { subscriber, userPreferences } from './test/mocks';
import { mockConfigService } from '../../../test/config.mock';

describe('SubscribeService', () => {
  let service: SubscribeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscribeService, mockConfigService],
    }).compile();

    service = module.get<SubscribeService>(SubscribeService);
  });

  describe('subscribeUser', () => {
    it('should add user to mailchimp', async () => {
      const result = {
        done: true,
      } as undefined as MembersSuccessResponse;
      jest.spyOn(lists, 'addListMember').mockResolvedValue(result);

      const expectedResult = await service.subscribeUser(subscriber);
      expect(expectedResult).toBe(result);
    });
  });

  describe('updatePreference', () => {
    it('should add user to mailchimp', async () => {
      const result = {
        done: true,
      } as undefined as MembersSuccessResponse;
      jest.spyOn(lists, 'updateListMember').mockResolvedValue(result);

      const expectedResult = await service.updatePreference(userPreferences);
      expect(expectedResult).toBe(result);
    });
  });
});
