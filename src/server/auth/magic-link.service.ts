import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AwsConfig } from '../config/application-config';
import { AuthException } from './types/AuthException';
import { User } from './types/User';
import {
  AdminDeleteUserCommand,
  AdminInitiateAuthCommand,
  CognitoIdentityProviderClient,
  ResendConfirmationCodeCommand,
  RespondToAuthChallengeCommand,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { CognitoAuthResponse } from './types/CognitoAuthResponse';
import { RegulatorService } from '../regulator/regulator.service';
import EmailAddressDto from './types/EmailAddress.dto';
import { v4 as uuidv4 } from 'uuid';
import decodeJwt from './utils/decodeJwt';
import { MagicLinkInitiationResponse } from './types/MagicLinkInitiationResponse';

@Injectable()
export class MagicLinkService {
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
      return new AuthException({
        code: err.__type,
        message: err.message,
        meta,
      });
    }
    return err;
  }

  async registerUser(emailAddressDto: EmailAddressDto) {
    const { email } = emailAddressDto;
    const createUserCommand = new SignUpCommand({
      ClientId: this.clientId,
      Username: email,
      Password: uuidv4(),
    });

    try {
      return await this.client.send(createUserCommand);
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

  async initiateAuthentication({
    email,
  }: EmailAddressDto): Promise<MagicLinkInitiationResponse> {
    const adminInitiateAuthCommand = new AdminInitiateAuthCommand({
      AuthFlow: 'CUSTOM_AUTH',
      ClientId: this.clientId,
      UserPoolId: this.userPoolId,
      AuthParameters: {
        USERNAME: email,
      },
    });

    try {
      return await this.client.send(adminInitiateAuthCommand);
    } catch (err) {
      throw this.getAuthError(err, { email });
    }
  }

  async respondToAuthChallenge({
    code,
    username,
    session,
  }: {
    code: string;
    username: string;
    session: string;
  }): Promise<User> {
    const authChallengeCommand = new RespondToAuthChallengeCommand({
      ClientId: this.clientId,
      ChallengeName: 'CUSTOM_CHALLENGE',
      ChallengeResponses: {
        USERNAME: username,
        ANSWER: code,
      },
      Session: session,
    });

    try {
      const cognitoResponse: CognitoAuthResponse = await this.client.send(
        authChallengeCommand,
      );

      const idToken = decodeJwt(cognitoResponse.AuthenticationResult.IdToken);

      const email = idToken.email;
      const regulator = await this.regulatorService.getRegulatorByEmail(email);

      return {
        cognitoUsername: idToken['cognito:username'],
        email,
        regulator,
        accessToken: cognitoResponse.AuthenticationResult.AccessToken,
      };
    } catch (err) {
      throw this.getAuthError(err, { code });
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
}
