import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AwsConfig } from '../config/application-config';
import {
  AdminAddUserToGroupCommand,
  AdminConfirmSignUpCommand,
  AdminDeleteUserCommand,
  AdminGetUserCommand,
  AdminInitiateAuthCommand,
  CognitoIdentityProviderClient,
  CreateGroupCommand,
  ListUsersInGroupCommand,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { CognitoAuthResponse } from './types/CognitoAuthResponse';
import { v4 as uuidv4 } from 'uuid';
import { RegulatorService } from '../regulator/regulator.service';
import CognitoUser from './types/CognitoUser';
import { AuthService } from './auth.service';
import { ApiClient, ListUsersInGroupCommandResponse } from './types/ApiClient';
import { CognitoRefreshResponse } from './types/CognitoRefreshResponse.dto';
import { User } from './types/User';

@Injectable()
export class ApiAuthService {
  private clientId: string;
  private userPoolId: string;

  private client;
  constructor(
    private readonly config: ConfigService,
    private readonly regulatorService: RegulatorService,
    private readonly authService: AuthService,
    private readonly logger: Logger,
  ) {
    const { cognito, region } = config.get<AwsConfig>('aws');
    this.client = new CognitoIdentityProviderClient({ region });
    this.clientId = cognito.apiClientId;
    this.userPoolId = cognito.apiUserPoolId;
  }

  async registerClient(user: User) {
    const clientId = uuidv4();
    const clientSecret = uuidv4();

    const createUserCommand = new SignUpCommand({
      ClientId: this.clientId,
      Username: clientId,
      Password: clientSecret,
      UserAttributes: [
        { Name: 'custom:regulator', Value: user.regulator?.id },
      ].filter((att) => !!att.Value),
    });

    const confirmUserCommand = new AdminConfirmSignUpCommand({
      UserPoolId: this.userPoolId,
      Username: clientId,
    });

    try {
      await this.client.send(createUserCommand);
      await this.addToRegulatorGroup(
        user.regulator?.id ?? user.cognitoUsername,
        clientId,
      );
      await this.client.send(confirmUserCommand);
      return { clientId, clientSecret };
    } catch (err) {
      this.logger.error('Api client registration error', err);
      throw err;
    }
  }

  async authenticateApiClient({
    clientSecret,
    clientId,
  }: {
    clientSecret: string;
    clientId: string;
  }): Promise<CognitoAuthResponse['AuthenticationResult']> {
    const adminInitiateAuthCommand = new AdminInitiateAuthCommand({
      AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
      ClientId: this.clientId,
      UserPoolId: this.userPoolId,
      AuthParameters: {
        USERNAME: clientId,
        PASSWORD: clientSecret,
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

  async getClient(clientId: string): Promise<CognitoUser> {
    const getUserCommand = new AdminGetUserCommand({
      UserPoolId: this.userPoolId,
      Username: clientId,
    });

    try {
      return this.client.send(getUserCommand);
    } catch (err) {
      throw err;
    }
  }

  private async addToRegulatorGroup(
    regulatorId: string,
    username: string,
  ): Promise<string> {
    const createGroupCommand = new CreateGroupCommand({
      UserPoolId: this.userPoolId,
      GroupName: regulatorId,
    });

    const addToGroupCommand = new AdminAddUserToGroupCommand({
      GroupName: regulatorId,
      Username: username,
      UserPoolId: this.userPoolId,
    });

    try {
      await this.client.send(createGroupCommand);
      return this.client.send(addToGroupCommand);
    } catch (err) {
      if (err.__type === 'GroupExistsException') {
        return this.client.send(addToGroupCommand);
      }
      throw err;
    }
  }

  async getApiClientsForUser(user: User): Promise<ApiClient[]> {
    return user.regulator?.id
      ? this.getApiClientsForGroup(user.regulator.id)
      : this.getApiClientsForGroup(user.cognitoUsername);
  }
  private async getApiClientsForGroup(groupId: string): Promise<ApiClient[]> {
    const listUsersInGroupCommand = new ListUsersInGroupCommand({
      UserPoolId: this.userPoolId,
      GroupName: groupId,
    });
    try {
      const response: ListUsersInGroupCommandResponse = await this.client.send(
        listUsersInGroupCommand,
      );

      return response.Users.sort(
        (a, b) =>
          new Date(b.UserCreateDate).valueOf() -
          new Date(a.UserCreateDate).valueOf(),
      );
    } catch (err) {
      if (err.__type === 'ResourceNotFoundException') {
        return [];
      }
      throw err;
    }
  }

  async refreshApiUser(
    token: string,
  ): Promise<CognitoRefreshResponse['AuthenticationResult']> {
    const adminInitiateAuthCommand = new AdminInitiateAuthCommand({
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      ClientId: this.clientId,
      UserPoolId: this.userPoolId,
      AuthParameters: {
        REFRESH_TOKEN: token,
      },
    });

    try {
      const result: CognitoRefreshResponse = await this.client.send(
        adminInitiateAuthCommand,
      );
      return result.AuthenticationResult;
    } catch (err) {
      throw err;
    }
  }

  async deleteApiClient(username: string): Promise<ApiClient[]> {
    const deleteUserCommand = new AdminDeleteUserCommand({
      UserPoolId: this.userPoolId,
      Username: username,
    });
    return this.client.send(deleteUserCommand);
  }
}
