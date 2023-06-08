import { magicLinkInitiationResponse } from './magicLink.mock';
import { ClientAuthService } from '../../src/server/auth/client-auth.service';

export const mockClientAuthService = {
  provide: ClientAuthService,
  useValue: {
    registerUser: () => 'MOCK_REGISTER_RESPONSE',
    initiateAuthentication: () => magicLinkInitiationResponse,
    respondToAuthChallenge: () => 'USER',
    deleteUser: () => 'DELETE_USER',
  },
};
