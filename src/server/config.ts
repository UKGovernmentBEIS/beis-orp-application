export interface ServerConfig {
  staticResourceCacheDuration: number;
}

export interface ApisConfig {
  mailchimp: { apiKey: string; server: string; list: string };
}

export interface AwsConfig {
  ingestionBucket: string;
  secretAccessKey: string;
  accessKeyId: string;
}

export interface Config {
  domain: string;
  server: ServerConfig;
  apis: ApisConfig;
  aws: AwsConfig;
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
    },
    aws: {
      ingestionBucket: process.env.S3_UPLOAD_BUCKET,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    },
  };
}
