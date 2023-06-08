import { SubscriberDto } from '../entities/subscriber.dto';
import { UserPreferenceDto } from '../entities/user-preference.dto';

export const subscriber: SubscriberDto = {
  emailAddress: 'test@test.com',
  b_421d6e3d31b5a15d8560c613d_d8234fcc62: '',
};

export const userPreferences: UserPreferenceDto = {
  subscription: 'subscribed',
  emailAddress: 'test@test.com',
};

const mockRedirect = jest.fn();
const mockGetResponse = jest.fn().mockImplementation(() => ({
  redirect: mockRedirect,
}));

const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getResponse: mockGetResponse,
  getRequest: jest.fn(),
}));

export const mockArgumentsHost = {
  switchToHttp: mockHttpArgumentsHost,
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};
