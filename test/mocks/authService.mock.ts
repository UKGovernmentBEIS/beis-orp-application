import { AuthService } from '../../src/server/auth/auth.service';
import { CORRECT_EMAIL } from '../e2e.fixture';

export const mockAuthService = {
  provide: AuthService,
  useValue: {
    registerUser: () => 'MOCK_REGISTER_RESPONSE',
    authenticateUser: () => ({ email: CORRECT_EMAIL }),
    resendConfirmationCode: () => ({ email: CORRECT_EMAIL }),
    resetPassword: () => 'CHANGE_PASSWORD',
    deleteUser: () => 'DELETE_USER',
    startForgotPassword: () => 'FORGOT_PASSWORD',
    confirmForgotPassword: () => 'NEW_PASSWORD_CONFIRM',
  },
};
