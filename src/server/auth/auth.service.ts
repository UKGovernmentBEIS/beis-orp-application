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
  AdminInitiateAuthCommand,
  AdminResetUserPasswordCommand,
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
  ResendConfirmationCodeCommand,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';

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
      throw new AuthException({ code: err.__type, meta: { email } });
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
      throw new AuthException({ code: err.__type, meta: { email } });
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
      throw new AuthException({ code: err.__type });
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
      throw new AuthException({ code: err.__type });
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
      throw new AuthException({ code: err.__type });
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
      throw new AuthException({ code: err.__type });
    }
  }
}
