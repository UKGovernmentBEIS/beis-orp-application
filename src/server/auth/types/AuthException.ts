type AuthExceptionCode = 'NotAuthorizedException' | 'ValidationException';

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
}
