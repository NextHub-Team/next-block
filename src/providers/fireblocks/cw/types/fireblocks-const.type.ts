import { FireblocksEnvironmentType } from './fireblocks-enum.type';

export type FireblocksEnvironmentUrlKey =
  | 'SANDBOX'
  | 'PROD_US'
  | 'PROD_EU'
  | 'PROD_EU2';

export const FIREBLOCKS_CW_ENABLE = false;

export const FIREBLOCKS_CW_API_KEY = '';

export const FIREBLOCKS_CW_SECRET_KEY = '';

export const FIREBLOCKS_CW_ENV_TYPE = FireblocksEnvironmentType.SANDBOX;

export const FIREBLOCKS_CW_REQUEST_TIMEOUT_MS = 30000;

export const FIREBLOCKS_CW_MAX_RETRIES = 3;

export const FIREBLOCKS_CW_CIRCUIT_BREAKER_FAILURE_THRESHOLD = 5;

export const FIREBLOCKS_CW_CIRCUIT_BREAKER_RESET_TIMEOUT_MS = 30000;

export const FIREBLOCKS_CW_CIRCUIT_BREAKER_HALF_OPEN_SAMPLE = 1;

export const FIREBLOCKS_CW_RATE_LIMIT_TOKENS_PER_INTERVAL = 10;

export const FIREBLOCKS_CW_RATE_LIMIT_INTERVAL_MS = 1000;

export const FIREBLOCKS_CW_DEBUG_LOGGING = false;

export const FIREBLOCKS_CW_VAULT_NAME_PREFIX = 'user';

export const FIREBLOCKS_ENVIRONMENT_BASE_URL: Record<
  FireblocksEnvironmentUrlKey,
  string
> = {
  SANDBOX: 'https://sandbox-api.fireblocks.io/v1',
  PROD_US: 'https://api.fireblocks.io/v1',
  PROD_EU: 'https://eu-api.fireblocks.io/v1',
  PROD_EU2: 'https://eu2-api.fireblocks.io/v1',
};
