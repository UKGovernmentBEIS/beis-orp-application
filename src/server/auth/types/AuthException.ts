export type AuthExceptionCode =
  | 'NotAuthorizedException'
  | 'ValidationException'
  | 'UserNotConfirmedException'
  | 'UsernameExistsException'
  | 'PasswordResetRequiredException'
  | 'UserNotFoundException'
  | 'LimitExceededException'
  | 'CodeMismatchException';

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

  isLimitExceeded() {
    return this.errorObj.code === 'LimitExceededException';
  }

  isCodeMismatch() {
    return this.errorObj.code === 'CodeMismatchException';
  }
}
