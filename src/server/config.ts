export interface ServerConfig {
  staticResourceCacheDuration: number;
}

export interface Config {
  server: ServerConfig;
}

export function config(): Config {
  return {
    server: {
      staticResourceCacheDuration: 20,
    },
  };
}
