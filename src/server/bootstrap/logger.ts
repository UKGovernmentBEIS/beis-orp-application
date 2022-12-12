import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import * as CloudWatchTransport from 'winston-cloudwatch';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { AwsConfig } from '../config';

function getTransportsForEnv(logGroupName?: string, logStreamName?: string) {
  const consoleTransport = new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.ms(),
      nestWinstonModuleUtilities.format.nestLike(),
    ),
  });

  if (!(logGroupName && logStreamName)) {
    return [consoleTransport];
  }
  return [
    consoleTransport,
    new CloudWatchTransport({
      name: 'Cloudwatch Logs',
      logGroupName,
      logStreamName,
      awsRegion: 'eu-west-2',
      messageFormatter: function ({ level, message, stack }) {
        return `${level}: ${message} ${stack ? stack : ''}`;
      },
    }),
  ];
}

export function useLogger(app: NestExpressApplication) {
  const configService = app.get(ConfigService);
  const { logStreamName, logGroupName } = configService.get<AwsConfig>('aws');

  app.useLogger(
    WinstonModule.createLogger({
      format: winston.format.uncolorize(),
      transports: getTransportsForEnv(logGroupName, logStreamName),
    }),
  );
}
