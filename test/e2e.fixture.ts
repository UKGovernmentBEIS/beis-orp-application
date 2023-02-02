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

export const CORRECT_EMAIL = 'reg@regulator.com';
export const CORRECT_NON_REG_EMAIL = 'noreg@email.com';
export const CORRECT_EMAIL_TO_DELETE = 'todelete@email.com';
export const CORRECT_PW = 'pw';
export const mockCognito = {
  send: jest.fn().mockImplementation((command) => {
    if (command.authRequest) {
      if (
        (command.AuthParameters.USERNAME === CORRECT_EMAIL ||
          command.AuthParameters.USERNAME === CORRECT_NON_REG_EMAIL ||
          command.AuthParameters.USERNAME === CORRECT_EMAIL_TO_DELETE) &&
        command.AuthParameters.PASSWORD === CORRECT_PW
      ) {
        return { user: command.AuthParameters.USERNAME };
      }
      throw new CognitoAuthError('NotAuthorizedException');
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
