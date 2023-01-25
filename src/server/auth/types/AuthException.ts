type AuthExceptionCode =
  | 'NotAuthorizedException'
  | 'ValidationException'
  | 'UserNotConfirmedException';

export class AuthException extends Error {
  constructor(
    public errorObj: { code: AuthExceptionCode; meta?: Record<string, any> },
  ) {
    super('Auth error');
  }

  isBadRequest() {
    return this.errorObj.code === 'ValidationException';
  }

  isNotAuthorized() {
    return this.errorObj.code === 'NotAuthorizedException';
  }

  isUnconfirmed() {
    return this.errorObj.code === 'UserNotConfirmedException';
  }
}
