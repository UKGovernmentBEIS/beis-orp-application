import { magicLinkInitiationResponse } from './magicLink.mock';
import { MagicLinkService } from '../../src/server/auth/magic-link.service';

export const mockMagicLinkService = {
  provide: MagicLinkService,
  useValue: {
    registerUser: () => 'MOCK_REGISTER_RESPONSE',
    initiateAuthentication: () => magicLinkInitiationResponse,
    respondToAuthChallenge: () => 'USER',
    deleteUser: () => 'DELETE_USER',
  },
};
