import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/server/app.module';
import { useGovUi } from '../src/server/bootstrap';
import * as request from 'supertest';
import * as path from 'path';
import { getMockedConfig } from './mocks/config.mock';
import { ConfigService } from '@nestjs/config';
import { usePassport } from '../src/server/bootstrap/passport';
import { CognitoAuthError } from './mocks/cognitoAuthError';
import { COGNITO_SUCCESSFUL_RESPONSE_REGULATOR } from './mocks/cognitoSuccessfulResponse';
import JwtAuthenticationGuard from '../src/server/auth/jwt.guard';
import JwtRegulatorGuard from '../src/server/auth/jwt-regulator.guard';
import { NextFunction, Request } from 'express';
import { ApiUser } from '../src/server/auth/types/User';
import * as session from 'express-session';
import { magicLinkInitiationResponse } from './mocks/magicLink.mock';

export const CORRECT_CODE = '123456';
export const mockCognito = {
  send: jest.fn().mockImplementation((command) => {
    if (command.authRequest) {
      return magicLinkInitiationResponse;
    }

    if (command.authChallengeResponse) {
      if (command.ChallengeResponses.ANSWER !== CORRECT_CODE) {
        throw new CognitoAuthError('NotAuthorizedException');
      }

      return COGNITO_SUCCESSFUL_RESPONSE_REGULATOR;
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
    RespondToAuthChallengeCommand: jest.fn((args) => ({
      ...args,
      authChallengeResponse: true,
    })),
    CognitoIdentityProviderClient: jest.fn(() => mockCognito),
    ResendConfirmationCodeCommand: jest.fn(),
    SignUpCommand: jest.fn(() => ({
      signUpCommand: true,
    })),
    ListUsersInGroupCommand: jest.fn((args) => ({
      ...args,
      listUsers: true,
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
    this.app.use(
      session({
        secret: 'my-secret',
        resave: false,
        saveUninitialized: false,
      }),
    );
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
    this.app.use((req, res, next) => {
      req.session.challengeSession = 'cogSession';
      req.session.challengeUsername = 'cogUsername';

      return next();
    });

    this.app.setBaseViewsDir(
      path.join(__dirname, '..', 'src', 'server', 'views'),
    );
    await this.app.init();
  }

  request() {
    return request(this.app.getHttpServer());
  }
}
