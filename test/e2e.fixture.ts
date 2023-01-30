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

const mockCogUserPool = {
  signUp: (email, password, userAttributes, validationData, callback) =>
    callback(undefined, { user: 'USER_MOCK' }),
};

export const CORRECT_EMAIL = 'reg@regulator.com';
export const CORRECT_NON_REG_EMAIL = 'noreg@email.com';
export const CORRECT_PW = 'pw';
export const mockCogUser = {
  authenticateUser: (authDetails, callbacks) => {
    if (
      (authDetails.Username === CORRECT_EMAIL ||
        authDetails.Username === CORRECT_NON_REG_EMAIL) &&
      authDetails.Password === CORRECT_PW
    ) {
      return callbacks.onSuccess();
    }
    callbacks.onFailure({ code: 'NotAuthorizedException' });
  },
  forgotPassword: jest.fn().mockImplementation((callbacks) => {
    return callbacks.onSuccess('RESET');
  }),
  confirmPassword: jest.fn().mockImplementation((code, pw, callbacks) => {
    return callbacks.onSuccess('RESET');
  }),
};

jest.mock('amazon-cognito-identity-js', () => {
  return {
    CognitoUserPool: jest.fn(() => mockCogUserPool),
    AuthenticationDetails: jest.fn((args) => args),
    CognitoUser: jest.fn(() => mockCogUser),
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
