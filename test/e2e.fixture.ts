import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/server/app.module';
import { useGovUi } from '../src/server/bootstrap';
import * as request from 'supertest';
import * as path from 'path';
import { getMockedConfig } from './mocks/config.mock';
import { ConfigService } from '@nestjs/config';
import { useSession } from '../src/server/bootstrap/session';
import { usePassport } from '../src/server/bootstrap/passport';
import { CognitoAuthError } from './mocks/cognitoAuthError';
import {
  COGNITO_SUCCESSFUL_RESPONSE_NON_REGULATOR,
  COGNITO_SUCCESSFUL_RESPONSE_REGULATOR,
} from './mocks/cognitoSuccessfulResponse';
import JwtAuthenticationGuard from '../src/server/auth/jwt.guard';
import JwtRegulatorGuard from '../src/server/auth/jwt-regulator.guard';
import { NextFunction } from 'express';
import { ApiUser } from '../src/server/auth/types/User';

export const CORRECT_EMAIL = 'reg@ofcom.org.uk';
export const CORRECT_NON_REG_EMAIL = 'noreg@email.com';
export const CORRECT_PW = 'pw';
export const mockCognito = {
  send: jest.fn().mockImplementation((command) => {
    if (command.authRequest) {
      if (command.AuthParameters.PASSWORD !== CORRECT_PW) {
        throw new CognitoAuthError('NotAuthorizedException');
      }
      if (command.AuthParameters.USERNAME === CORRECT_EMAIL) {
        return COGNITO_SUCCESSFUL_RESPONSE_REGULATOR;
      }
      if (command.AuthParameters.USERNAME === CORRECT_NON_REG_EMAIL) {
        return COGNITO_SUCCESSFUL_RESPONSE_NON_REGULATOR;
      }
    }

    if (command.listUsers) {
      return {
        Users: [
          { Username: 'CLIENT', UserCreateDate: '2015-07-01T00:00:00Z' },
          { Username: 'CLIENT2', UserCreateDate: '2015-08-01T00:00:00Z' },
        ],
      };
    }
    return 'COG SUCCESS';
  }),
};

jest.mock('@aws-sdk/client-cognito-identity-provider', () => {
  return {
    AdminDeleteUserCommand: jest.fn(() => ({
      deleteUserCommand: true,
    })),
    AdminInitiateAuthCommand: jest.fn((args) => ({
      ...args,
      authRequest: true,
    })),
    AdminResetUserPasswordCommand: jest.fn(),
    CognitoIdentityProviderClient: jest.fn(() => mockCognito),
    ConfirmForgotPasswordCommand: jest.fn(() => ({
      confirmForgotPasswordCommand: true,
    })),
    ResendConfirmationCodeCommand: jest.fn(),
    SignUpCommand: jest.fn(() => ({
      signUpCommand: true,
    })),
    ListUsersInGroupCommand: jest.fn((args) => ({
      ...args,
      listUsers: true,
    })),
    ChangePasswordCommand: jest.fn(),
    ForgotPasswordCommand: jest.fn(() => ({
      forgotPasswordCommand: true,
    })),
  };
});
export class E2eFixture {
  private app: NestExpressApplication;

  async init(user?: 'API_REG' | 'API_NON_REG') {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: getMockedConfig,
      })
      .overrideGuard(JwtAuthenticationGuard)
      .useValue({
        canActivate: () => true,
      })
      .overrideGuard(JwtRegulatorGuard)
      .useValue({
        canActivate: () => ({
          help: 'me',
        }),
      })
      .compile();

    this.app = moduleFixture.createNestApplication<NestExpressApplication>();
    useGovUi(this.app);
    useSession(this.app);
    usePassport(this.app);

    if (user === 'API_REG') {
      this.app.use(
        (
          req: Request & { user?: ApiUser },
          res: Response,
          next: NextFunction,
        ) => {
          req.user = {
            cognitoUsername: 'cogun',
            regulator: 'regulator',
          };

          return next();
        },
      );
    }
    this.app.setBaseViewsDir(
      path.join(__dirname, '..', 'src', 'server', 'views'),
    );
    await this.app.init();
  }

  request() {
    return request(this.app.getHttpServer());
  }
}
