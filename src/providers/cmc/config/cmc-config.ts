// src/providers/cmc/config/cmc-config.ts
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { CmcConfig } from './cmc-config.type';
import {
  CMC_DEFAULT_FIAT_CURRENCY,
  CMC_DEFAULT_SYMBOLS,
  CMC_ENABLE,
  CMC_ENV_TYPE,
  CMC_MAX_RETRIES,
  CMC_REQUEST_TIMEOUT_MS,
  CMC_TTL_MS,
} from '../types/cmc-const.type';
import { CmcEnvironmenType } from '../types/cmc-enum.type';
import { mapEnvType } from '../../../utils/helpers/env.helper';
import { createToggleableConfig } from '../../../config/config.helper';

class CmcEnvironmentVariablesValidator {
  @IsString()
  CMC_API_KEY: string;

  @IsString()
  @IsOptional()
  CMC_ENV_TYPE?: string;

  @IsBoolean()
  @IsOptional()
  CMC_ENABLE?: boolean;

  @IsInt()
  @Min(0)
  @IsOptional()
  CMC_TTL_MS?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  CMC_REQUEST_TIMEOUT_MS?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  CMC_MAX_RETRIES?: number;

  @IsString()
  @IsOptional()
  CMC_DEFAULT_FIAT_CURRENCY?: string;

  /** Comma-separated list of default symbols (e.g., "BTC,ETH,SOL") */
  @IsString()
  @IsOptional()
  CMC_DEFAULT_SYMBOLS?: string;
}

function getDefaultSymbols(): string {
  return Array.isArray(CMC_DEFAULT_SYMBOLS)
    ? CMC_DEFAULT_SYMBOLS.map((s) => String(s).toUpperCase()).join(',')
    : String(CMC_DEFAULT_SYMBOLS).toUpperCase();
}

function normalizeSymbols(raw?: string): string {
  if (raw && raw.length > 0) {
    return raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => s.toUpperCase())
      .join(',');
  }
  return getDefaultSymbols();
}

const defaults: CmcConfig = {
  enable: CMC_ENABLE,
  apiKey: '',
  envType: CMC_ENV_TYPE,
  ttlMs: CMC_TTL_MS,
  requestTimeoutMs: CMC_REQUEST_TIMEOUT_MS,
  maxRetries: CMC_MAX_RETRIES,
  defaultFiatCurrency: CMC_DEFAULT_FIAT_CURRENCY,
  defaultSymbols: getDefaultSymbols(),
};

export default createToggleableConfig<CmcConfig, CmcEnvironmentVariablesValidator>(
  'cmc',
  CmcEnvironmentVariablesValidator,
  defaults,
  {
    enableKey: 'enable',
    enableEnvKey: 'CMC_ENABLE',
    mapEnabledConfig: (env) => {
      const ttlMs = env.CMC_TTL_MS ?? CMC_TTL_MS;
      const requestTimeoutMs =
        env.CMC_REQUEST_TIMEOUT_MS ?? CMC_REQUEST_TIMEOUT_MS;
      const maxRetries = env.CMC_MAX_RETRIES ?? CMC_MAX_RETRIES;

      const envType = mapEnvType<CmcEnvironmenType>(
        env.CMC_ENV_TYPE,
        {
          prod: CmcEnvironmenType.PRODUCTION,
          production: CmcEnvironmenType.PRODUCTION,
          sandbox: CmcEnvironmenType.SANDBOX,
          dev: CmcEnvironmenType.SANDBOX,
          development: CmcEnvironmenType.SANDBOX,
        },
        CMC_ENV_TYPE,
      );

      return {
        apiKey: env.CMC_API_KEY,
        envType,
        ttlMs,
        requestTimeoutMs,
        maxRetries,
        defaultFiatCurrency:
          env.CMC_DEFAULT_FIAT_CURRENCY || CMC_DEFAULT_FIAT_CURRENCY,
        defaultSymbols: normalizeSymbols(env.CMC_DEFAULT_SYMBOLS),
      } satisfies Partial<CmcConfig>;
    },
  },
);
