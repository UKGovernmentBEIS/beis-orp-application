export interface ServerConfig {
  staticResourceCacheDuration: number;
}

export interface ApisConfig {
  mailchimp: { apiKey: string; server: string; list: string };
  orpSearch: { url: string };
}

export interface AwsConfig {
  ingestionBucket: string;
  logGroupName: string;
  logStreamName: string;
}

export interface Secrets {
  uploadKey: string;
}

export interface Config {
  domain: string;
  server: ServerConfig;
  apis: ApisConfig;
  aws: AwsConfig;
  secrets: Secrets;
}

export function config(): Config {
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
    },
    aws: {
      ingestionBucket: process.env.S3_UPLOAD_BUCKET,
      logGroupName: process.env.CLOUDWATCH_GROUP_NAME,
      logStreamName: process.env.CLOUDWATCH_STREAM_NAME,
    },
    secrets: {
      uploadKey: process.env.API_UPLOAD_KEY,
    },
  };
}
