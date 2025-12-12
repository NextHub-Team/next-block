import { FireblocksEnvironmentType } from '../types/fireblocks-enum.type';

export type FireblocksConfig = {
  enable: boolean;
  apiKey: string;
  /** Raw PEM string or file system path to the private key. */
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
