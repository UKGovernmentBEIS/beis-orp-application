export type AuthExceptionCode =
  | 'NotAuthorizedException'
  | 'ValidationException'
  | 'UserNotConfirmedException'
  | 'UsernameExistsException'
  | 'PasswordResetRequiredException'
  | 'UserNotFoundException'
  | 'LimitExceededException';

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

  isNotFound() {
    return this.errorObj.code === 'UserNotFoundException';
  }

  isUnconfirmed() {
    return this.errorObj.code === 'UserNotConfirmedException';
  }

  isEmailInUse() {
    return this.errorObj.code === 'UsernameExistsException';
  }
}
