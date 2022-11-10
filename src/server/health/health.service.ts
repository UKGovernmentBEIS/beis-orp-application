import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { Injectable, Logger } from '@nestjs/common';
import { Health, HealthError } from './types';

const readFile = promisify(fs.readFile);

// TODO check dependent services when implented
@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  async getHealth(): Promise<Health> {
    const build = await this.getBuildInfo();
    const result: Health = {
      healthy: true,
      uptime: process.uptime(),
      build,
      version: build?.buildNumber,
    };

    if (result.healthy) {
      return result;
    }

    throw new HealthError(result);
  }

  private async getBuildInfo(): Promise<Health['build']> {
    try {
      const json = await readFile(path.join(__dirname, 'build-info.json'), {
        encoding: 'utf8',
      });
      return JSON.parse(json);
    } catch (e) {
      this.logger.error(`failed to read build info ${e.message}`);
      return null;
    }
  }
}
