export type AuthExceptionCode =
  | 'NotAuthorizedException'
  | 'ValidationException'
  | 'UserNotConfirmedException'
  | 'UsernameExistsException'
  | 'PasswordResetRequiredException'
  | 'UserNotFoundException'
  | 'LimitExceededException'
  | 'CodeMismatchException'
  | 'UserLambdaValidationException'; // no user

export class AuthException extends Error {
  constructor(
    public errorObj: {
      code: AuthExceptionCode;
      message?: string;
      meta?: Record<string, any>;
    },
  ) {
    super('Auth error');
  }

  isBadRequest() {
    return this.errorObj.code === 'ValidationException';
  }

  isNotAuthorized() {
    return this.errorObj.code === 'NotAuthorizedException';
  }

  isInvalidSession() {
    return (
      this.errorObj.code === 'NotAuthorizedException' &&
      this.errorObj.message &&
      this.errorObj.message
        .toLowerCase()
        .includes('invalid session for the user')
    );
  }

  isNotFound() {
    return (
      this.errorObj.code === 'UserNotFoundException' ||
      this.errorObj.code === 'UserLambdaValidationException'
    );
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
