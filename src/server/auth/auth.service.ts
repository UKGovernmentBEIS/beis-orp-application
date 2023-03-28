import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AwsConfig } from '../config/application-config';
import AuthRegisterDto from './types/AuthRegister.dto';
import { AuthException } from './types/AuthException';
import ForgotPasswordResetDto from './types/ForgotPasswordResetDto';
import { User } from './types/User';
import {
  AdminDeleteUserCommand,
  AdminInitiateAuthCommand,
  ChangePasswordCommand,
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
  ForgotPasswordCommand,
  ResendConfirmationCodeCommand,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { CognitoAuthResponse } from './types/CognitoAuthResponse';
import { RegulatorService } from '../regulator/regulator.service';
import decodeJwt from './utils/decodeJwt';
import ResetPasswordDto from './types/ResetPassword.dto';

@Injectable()
export class AuthService {
  private clientId: string;
  private userPoolId: string;

  private client;
  constructor(
    private readonly config: ConfigService,
    private readonly regulatorService: RegulatorService,
  ) {
    const { cognito, region } = config.get<AwsConfig>('aws');
    this.client = new CognitoIdentityProviderClient({ region });
    this.clientId = cognito.clientId;
    this.userPoolId = cognito.userPoolId;
  }

  private getAuthError(err: any, meta = {}) {
    if (!!err.__type) {
      return new AuthException({ code: err.__type, meta });
    }
    return err;
  }
  async registerUser(authRegisterUserDto: AuthRegisterDto) {
    const { email, password } = authRegisterUserDto;
    const createUserCommand = new SignUpCommand({
      ClientId: this.clientId,
      Username: email,
      Password: password,
    });

    try {
      return await this.client.send(createUserCommand);
    } catch (err) {
      throw this.getAuthError(err, { email });
    }
  }

  async authenticateUser({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<User> {
    const adminInitiateAuthCommand = new AdminInitiateAuthCommand({
      AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
      ClientId: this.clientId,
      UserPoolId: this.userPoolId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    try {
      const cognitoResponse: CognitoAuthResponse = await this.client.send(
        adminInitiateAuthCommand,
      );
      const idToken = decodeJwt(cognitoResponse.AuthenticationResult.IdToken);
      const regulator = await this.regulatorService.getRegulatorByEmail(email);

      return {
        cognitoUsername: idToken['cognito:username'],
        email,
        regulator,
        accessToken: cognitoResponse.AuthenticationResult.AccessToken,
      };
    } catch (err) {
      throw this.getAuthError(err, { email });
    }
  }

  async resendConfirmationCode(email: string) {
    const resendConfirmationCode = new ResendConfirmationCodeCommand({
      ClientId: this.clientId,
      Username: email,
    });

    try {
      return await this.client.send(resendConfirmationCode);
    } catch (err) {
      throw this.getAuthError(err);
    }
  }

  async deleteUser({ email }: User) {
    const deleteUserCommand = new AdminDeleteUserCommand({
      UserPoolId: this.userPoolId,
      Username: email,
    });

    try {
      return await this.client.send(deleteUserCommand);
    } catch (err) {
      throw this.getAuthError(err);
    }
  }

  async startForgotPassword(email: string) {
    const forgotPasswordCommand = new ForgotPasswordCommand({
      ClientId: this.clientId,
      Username: email,
    });

    try {
      return await this.client.send(forgotPasswordCommand);
    } catch (err) {
      throw this.getAuthError(err);
    }
  }

  async confirmForgotPassword({
    verificationCode,
    email,
    newPassword,
  }: ForgotPasswordResetDto) {
    const confirmForgotPasswordCommand = new ConfirmForgotPasswordCommand({
      ClientId: this.clientId,
      ConfirmationCode: verificationCode,
      Password: newPassword,
      Username: email,
    });

    try {
      return await this.client.send(confirmForgotPasswordCommand);
    } catch (err) {
      throw this.getAuthError(err);
    }
  }

  async resetPassword(
    { accessToken }: User,
    { previousPassword, newPassword }: ResetPasswordDto,
  ) {
    const changePasswordCommand = new ChangePasswordCommand({
      AccessToken: accessToken,
      PreviousPassword: previousPassword,
      ProposedPassword: newPassword,
    });

    try {
      return await this.client.send(changePasswordCommand);
    } catch (err) {
      throw this.getAuthError(err);
    }
  }
}
