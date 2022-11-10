export interface Health {
  healthy: boolean;
  uptime: number;
  build?: { buildNumber: string; gitRef: string };
  version?: string;
}

export class HealthError extends Error {
  constructor(public readonly health: Health) {
    super(`the service is unhealthy ${JSON.stringify(health)}`);
  }
}
