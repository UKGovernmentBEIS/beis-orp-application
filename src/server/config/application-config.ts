import * as process from 'process';

export interface ServerConfig {
  staticResourceCacheDuration: number;
}

export interface ApisConfig {
  mailchimp: { apiKey: string; server: string; list: string };
  orpSearch: { url: string };
  urlIngestion: { url: string };
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
}

export interface ApplicationConfig {
  domain: string;
  server: ServerConfig;
  apis: ApisConfig;
  aws: AwsConfig;
  secrets: Secrets;
}

export function config(): ApplicationConfig {
  return {
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
    },
  };
}
