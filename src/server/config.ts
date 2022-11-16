export interface ServerConfig {
  staticResourceCacheDuration: number;
}

export interface ApisConfig {
  mailchimp: { apiKey: string; server: string; list: string };
}

export interface Config {
  server: ServerConfig;
  apis: ApisConfig;
}

export function config(): Config {
  return {
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
  };
}
