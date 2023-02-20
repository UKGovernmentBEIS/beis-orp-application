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
import { PrismaService } from '../src/server/prisma/prisma.service';
import { CognitoAuthError } from './mocks/cognitoAuthError';
import JwtAuthenticationGuard from '../src/server/auth/jwt.guard';
import JwtRegulatorGuard from '../src/server/auth/jwt-regulator.guard';
import {
  COGNITO_SUCCESSFUL_RESPONSE_NON_REGULATOR,
  COGNITO_SUCCESSFUL_RESPONSE_REGULATOR,
} from './mocks/cognitoSuccessfulResponse';

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
    ConfirmForgotPasswordCommand: jest.fn(),
    ResendConfirmationCodeCommand: jest.fn(),
    SignUpCommand: jest.fn(),
    ListUsersInGroupCommand: jest.fn((args) => ({
      ...args,
      listUsers: true,
    })),
  };
});
export class E2eFixture {
  private app: NestExpressApplication;
  private prismaService: PrismaService;

  async init() {
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
        canActivate: () => true,
      })
      .compile();

    this.app = moduleFixture.createNestApplication<NestExpressApplication>();
    this.prismaService = moduleFixture.get(PrismaService);
    useGovUi(this.app);
    useSession(this.app);
    usePassport(this.app);
    this.app.setBaseViewsDir(
      path.join(__dirname, '..', 'src', 'server', 'views'),
    );
    await this.app.init();
  }

  request() {
    return request(this.app.getHttpServer());
  }

  tearDown() {
    this.app.close();
    this.prismaService.$disconnect();
  }
}
