import { FireblocksEnvironmentType } from './fireblocks-enum.type';

export type FireblocksClientOptions = {
  enable: boolean;
  apiKey: string;
  secretKey: string;
  envType: FireblocksEnvironmentType;
  requestTimeoutMs: number;
  maxRetries: number;
  circuitBreaker: {
    failureThreshold: number;
    resetTimeoutMs: number;
    halfOpenSample: number;
  };
  rateLimit: {
    tokensPerInterval: number;
    intervalMs: number;
  };
  debugLogging: boolean;
  vaultNamePrefix: string;
};
