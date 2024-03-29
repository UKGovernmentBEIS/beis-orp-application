import * as process from 'process';

export interface ServerConfig {
  staticResourceCacheDuration: number;
}

export interface ApisConfig {
  mailchimp: { apiKey: string; server: string; list: string };
  orpSearch: { url: string };
  urlIngestion: { url: string };
  documentDeletion: { url: string };
}

export interface AwsConfig {
  ingestionBucket: string;
  logGroupName: string;
  logStreamName: string;
  region: string;
  cognito: {
    userPoolId: string;
    clientId: string;
    apiUserPoolId: string;
    apiClientId: string;
  };
}

export interface Secrets {
  uploadKey: string;
  session: string;
}

export interface Redis {
  address: string;
  port: number;
}

export interface ApplicationConfig {
  isProduction: boolean;
  domain: string;
  server: ServerConfig;
  apis: ApisConfig;
  aws: AwsConfig;
  secrets: Secrets;
  redis: Redis;
  environmentRegulators: string;
}

export function config(): ApplicationConfig {
  return {
    isProduction: process.env.NODE_ENV === 'production',
    domain: process.env.DOMAIN,
    server: {
      staticResourceCacheDuration: 20,
    },
    apis: {
      mailchimp: {
        apiKey: process.env.MC_API_KEY,
        server: process.env.MC_SERVER,
        list: process.env.MC_LIST,
      },
      orpSearch: {
        url: process.env.ORP_SEARCH_URL,
      },
      urlIngestion: {
        url: process.env.HTML_INGESTION_URL,
      },
      documentDeletion: {
        url: process.env.DELETE_DOCUMENT_URL,
      },
    },
    aws: {
      ingestionBucket: process.env.S3_UPLOAD_BUCKET,
      logGroupName: process.env.CLOUDWATCH_GROUP_NAME,
      logStreamName: process.env.CLOUDWATCH_STREAM_NAME,
      region: process.env.AWS_REGION,
      cognito: {
        userPoolId: process.env.COGNITO_USER_POOL,
        clientId: process.env.COGNITO_CLIENT_ID,
        apiUserPoolId: process.env.COGNITO_API_USER_POOL,
        apiClientId: process.env.COGNITO_API_CLIENT_ID,
      },
    },
    secrets: {
      uploadKey: process.env.API_UPLOAD_KEY,
      session: process.env.SESSION_SECRET,
    },
    redis: {
      address: process.env.REDIS_ADDRESS,
      port: Number(process.env.REDIS_PORT),
    },
    environmentRegulators: process.env.REGULATOR_ACCESS ?? '',
  };
}
