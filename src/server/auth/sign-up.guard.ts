import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RegulatorService } from '../regulator/regulator.service';
import { InvalidDomainException } from './entities/invalid-domain.exception';

@Injectable()
export class SignUpGuard implements CanActivate {
  constructor(private regulatorService: RegulatorService) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (!this.regulatorService.getRegulatorByEmail(request.body.email)) {
      throw new InvalidDomainException();
    }
    return true;
  }
}
