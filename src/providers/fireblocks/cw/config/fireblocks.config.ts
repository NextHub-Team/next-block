import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { createToggleableConfig } from '../../../../config/config.helper';
import { mapEnvType } from '../../../../utils/helpers/env.helper';
import { FireblocksConfig } from './fireblocks-config.type';
import { FireblocksEnvironmentType } from '../types/fireblocks-enum.type';
import {
  FIREBLOCKS_API_KEY,
  FIREBLOCKS_ENABLE,
  FIREBLOCKS_ENV_TYPE,
  FIREBLOCKS_MAX_RETRIES,
  FIREBLOCKS_RATE_LIMIT_INTERVAL_MS,
  FIREBLOCKS_RATE_LIMIT_TOKENS_PER_INTERVAL,
  FIREBLOCKS_REQUEST_TIMEOUT_MS,
  FIREBLOCKS_SECRET_KEY,
  FIREBLOCKS_CIRCUIT_BREAKER_FAILURE_THRESHOLD,
  FIREBLOCKS_CIRCUIT_BREAKER_HALF_OPEN_SAMPLE,
  FIREBLOCKS_CIRCUIT_BREAKER_RESET_TIMEOUT_MS,
  FIREBLOCKS_DEBUG_LOGGING,
  FIREBLOCKS_VAULT_NAME_PREFIX,
} from '../types/fireblocks-const.type';

class FireblocksEnvValidator {
  @IsString()
  @IsOptional()
  FIREBLOCKS_API_KEY?: string;

  @IsString()
  @IsOptional()
  FIREBLOCKS_SECRET_KEY?: string;

  @IsString()
  @IsOptional()
  FIREBLOCKS_ENV_TYPE?: string;

  @IsBoolean()
  @IsOptional()
  FIREBLOCKS_ENABLE?: boolean;

  @IsInt()
  @Min(0)
  @IsOptional()
  FIREBLOCKS_REQUEST_TIMEOUT_MS?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  FIREBLOCKS_MAX_RETRIES?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  FIREBLOCKS_CIRCUIT_BREAKER_FAILURE_THRESHOLD?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  FIREBLOCKS_CIRCUIT_BREAKER_RESET_TIMEOUT_MS?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  FIREBLOCKS_CIRCUIT_BREAKER_HALF_OPEN_SAMPLE?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  FIREBLOCKS_RATE_LIMIT_TOKENS_PER_INTERVAL?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  FIREBLOCKS_RATE_LIMIT_INTERVAL_MS?: number;

  @IsBoolean()
  @IsOptional()
  FIREBLOCKS_DEBUG_LOGGING?: boolean;

  @IsString()
  @IsOptional()
  FIREBLOCKS_VAULT_NAME_PREFIX?: string;
}

const defaults: FireblocksConfig = {
  enable: FIREBLOCKS_ENABLE,
  apiKey: FIREBLOCKS_API_KEY,
  secretKey: FIREBLOCKS_SECRET_KEY,
  envType: FIREBLOCKS_ENV_TYPE,
  requestTimeoutMs: FIREBLOCKS_REQUEST_TIMEOUT_MS,
  maxRetries: FIREBLOCKS_MAX_RETRIES,
  circuitBreaker: {
    failureThreshold: FIREBLOCKS_CIRCUIT_BREAKER_FAILURE_THRESHOLD,
    resetTimeoutMs: FIREBLOCKS_CIRCUIT_BREAKER_RESET_TIMEOUT_MS,
    halfOpenSample: FIREBLOCKS_CIRCUIT_BREAKER_HALF_OPEN_SAMPLE,
  },
  rateLimit: {
    tokensPerInterval: FIREBLOCKS_RATE_LIMIT_TOKENS_PER_INTERVAL,
    intervalMs: FIREBLOCKS_RATE_LIMIT_INTERVAL_MS,
  },
  debugLogging: FIREBLOCKS_DEBUG_LOGGING,
  vaultNamePrefix: FIREBLOCKS_VAULT_NAME_PREFIX,
};

export default createToggleableConfig<FireblocksConfig, FireblocksEnvValidator>(
  'fireblocks',
  FireblocksEnvValidator,
  defaults,
  {
    enableKey: 'enable',
    enableEnvKey: 'FIREBLOCKS_ENABLE',
    mapEnabledConfig: (env) => {
      const envType = mapEnvType<FireblocksEnvironmentType>(
        env.FIREBLOCKS_ENV_TYPE,
        {
          prod: FireblocksEnvironmentType.PROD_US,
          production: FireblocksEnvironmentType.PROD_US,
          'prod-us': FireblocksEnvironmentType.PROD_US,
          us: FireblocksEnvironmentType.PROD_US,
          'prod-eu': FireblocksEnvironmentType.PROD_EU,
          eu: FireblocksEnvironmentType.PROD_EU,
          sandbox: FireblocksEnvironmentType.SANDBOX,
          dev: FireblocksEnvironmentType.SANDBOX,
          development: FireblocksEnvironmentType.SANDBOX,
        },
        defaults.envType,
      );

      const requestTimeoutMs =
        env.FIREBLOCKS_REQUEST_TIMEOUT_MS ?? defaults.requestTimeoutMs;
      const maxRetries = env.FIREBLOCKS_MAX_RETRIES ?? defaults.maxRetries;
      const failureThreshold =
        env.FIREBLOCKS_CIRCUIT_BREAKER_FAILURE_THRESHOLD ??
        defaults.circuitBreaker.failureThreshold;
      const resetTimeoutMs =
        env.FIREBLOCKS_CIRCUIT_BREAKER_RESET_TIMEOUT_MS ??
        defaults.circuitBreaker.resetTimeoutMs;
      const halfOpenSample =
        env.FIREBLOCKS_CIRCUIT_BREAKER_HALF_OPEN_SAMPLE ??
        defaults.circuitBreaker.halfOpenSample;
      const tokensPerInterval =
        env.FIREBLOCKS_RATE_LIMIT_TOKENS_PER_INTERVAL ??
        defaults.rateLimit.tokensPerInterval;
      const intervalMs =
        env.FIREBLOCKS_RATE_LIMIT_INTERVAL_MS ?? defaults.rateLimit.intervalMs;
      const debugLogging =
        env.FIREBLOCKS_DEBUG_LOGGING ?? defaults.debugLogging;
      const vaultNamePrefix =
        env.FIREBLOCKS_VAULT_NAME_PREFIX ?? defaults.vaultNamePrefix;

      return {
        apiKey: env.FIREBLOCKS_API_KEY ?? defaults.apiKey,
        secretKey: env.FIREBLOCKS_SECRET_KEY ?? defaults.secretKey,
        envType,
        requestTimeoutMs,
        maxRetries,
        circuitBreaker: {
          failureThreshold,
          resetTimeoutMs,
          halfOpenSample,
        },
        rateLimit: { tokensPerInterval, intervalMs },
        debugLogging,
        vaultNamePrefix,
      } satisfies Partial<FireblocksConfig>;
    },
  },
);
