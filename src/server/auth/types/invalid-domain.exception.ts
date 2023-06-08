import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidDomainException extends HttpException {
  constructor() {
    super('Invalid domain', HttpStatus.FORBIDDEN);
  }
}
