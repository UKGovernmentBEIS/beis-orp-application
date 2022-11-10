import { Controller, Get } from '@nestjs/common';
import { Health } from './types';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly service: HealthService) {}

  @Get()
  get(): Promise<Health> {
    return this.service.getHealth();
  }
}
