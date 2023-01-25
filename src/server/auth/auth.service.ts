import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { AwsConfig } from '../config';
import AuthRegisterDto from './types/AuthRegister.dto';
import { AuthException } from './types/AuthException';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;
  constructor(private readonly config: ConfigService) {
    const { cognito } = config.get<AwsConfig>('aws');
    this.userPool = new CognitoUserPool({
      UserPoolId: cognito.userPoolId,
      ClientId: cognito.clientId,
    });
  }

  async registerUser(authRegisterUserDto: AuthRegisterDto) {
    const { email, password } = authRegisterUserDto;

    return new Promise((resolve, reject) => {
      this.userPool.signUp(email, password, null, null, (err, result) => {
        if (!result) {
          reject(err);
        } else {
          resolve(result.user);
        }
      });
    });
  }

  authenticateUser({ email, password }: { email: string; password: string }) {
    const userData = { Username: email, Pool: this.userPool };
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });
    const cognitoUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: () => {
          // TODO get corresponding user from db
          resolve({
            email,
          });
        },
        onFailure: (err) => {
          reject(new AuthException(err));
        },
      });
    });
  }
}
