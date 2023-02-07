import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AwsConfig } from '../config';
import AuthRegisterDto from './types/AuthRegister.dto';
import { AuthException } from './types/AuthException';
import { UserService } from '../user/user.service';
import ConfirmPasswordDto from './types/ConfirmPassword.dto';
import { User } from '@prisma/client';
import {
  AdminDeleteUserCommand,
  AdminGetUserCommand,
  AdminInitiateAuthCommand,
  AdminResetUserPasswordCommand,
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
  ResendConfirmationCodeCommand,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import CognitoUser from './types/CognitoUser';
import AuthenticationResultDto, {
  CognitoAuthResponse,
} from './types/AuthenticationResult.dto';

@Injectable()
export class AuthService {
  private clientId: string;
  private userPoolId: string;

  private client;
  constructor(
    private readonly config: ConfigService,
    private readonly userService: UserService,
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
      await this.client.send(createUserCommand);
      return this.userService.createUser(email);
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
  }) {
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
      await this.client.send(adminInitiateAuthCommand);
      return this.userService.getUserByEmail(email);
    } catch (err) {
      throw this.getAuthError(err, { email });
    }
  }

  async authenticateApiUser({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<AuthenticationResultDto> {
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
      const result: CognitoAuthResponse = await this.client.send(
        adminInitiateAuthCommand,
      );
      return result.AuthenticationResult;
    } catch (err) {
      throw err;
    }
  }

  async resendConfirmationCode(email: string) {
    const resendConfirmationCode = new ResendConfirmationCodeCommand({
      ClientId: this.clientId,
      Username: email,
    });

    try {
      const result = await this.client.send(resendConfirmationCode);
      return result;
    } catch (err) {
      throw this.getAuthError(err);
    }
  }

  async startResetPassword({ email }: User) {
    const adminResetPasswordCommand = new AdminResetUserPasswordCommand({
      UserPoolId: this.userPoolId,
      Username: email,
    });

    try {
      return await this.client.send(adminResetPasswordCommand);
    } catch (err) {
      throw this.getAuthError(err);
    }
  }

  async confirmPassword({
    verificationCode,
    email,
    newPassword,
  }: ConfirmPasswordDto) {
    const confirmPasswordCommand = new ConfirmForgotPasswordCommand({
      ClientId: this.clientId,
      Username: email,
      Password: newPassword,
      ConfirmationCode: verificationCode,
    });

    try {
      const result = await this.client.send(confirmPasswordCommand);
      return result;
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
      await this.client.send(deleteUserCommand);
      return this.userService.deleteUser(email);
    } catch (err) {
      throw this.getAuthError(err);
    }
  }

  async getUser(username: string): Promise<CognitoUser> {
    const getUserCommand = new AdminGetUserCommand({
      UserPoolId: this.userPoolId,
      Username: username,
    });

    try {
      return this.client.send(getUserCommand);
    } catch (err) {
      throw this.getAuthError(err);
    }
  }
}
