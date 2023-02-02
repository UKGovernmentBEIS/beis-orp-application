export class CognitoAuthError extends Error {
  public __type: string;
  constructor(type) {
    super('Cognito Error');
    this.name = this.constructor.name;
    this.__type = type;

    Error.captureStackTrace(this, this.constructor);
  }
}
