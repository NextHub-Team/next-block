import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
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
import { createToggleableConfig } from '../../../config/config.helper';
import { mapEnvType } from '../../../utils/helpers/env.helper';

class EnvironmentVariablesValidator {
  @IsString()
  @IsNotEmpty()
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

const FALLBACK_SYMBOLS = toSymbolList(CMC_DEFAULT_SYMBOLS);

export default createToggleableConfig<CmcConfig>(
  'cmc',
  EnvironmentVariablesValidator,
  {
    enable: CMC_ENABLE,
    apiKey: '',
    envType: CMC_ENV_TYPE,
    ttlMs: CMC_TTL_MS,
    requestTimeoutMs: CMC_REQUEST_TIMEOUT_MS,
    maxRetries: CMC_MAX_RETRIES,
    defaultFiatCurrency: CMC_DEFAULT_FIAT_CURRENCY,
    defaultSymbols: FALLBACK_SYMBOLS,
  },
  'enable',
  'CMC_ENABLE',
  {
    apiKey: 'CMC_API_KEY',
    envType: 'CMC_ENV_TYPE',
    ttlMs: 'CMC_TTL_MS',
    requestTimeoutMs: 'CMC_REQUEST_TIMEOUT_MS',
    maxRetries: 'CMC_MAX_RETRIES',
    defaultFiatCurrency: 'CMC_DEFAULT_FIAT_CURRENCY',
    defaultSymbols: 'CMC_DEFAULT_SYMBOLS',
  },
  (resolved) => {
    const envType = mapEnvType<CmcEnvironmenType>(
      typeof resolved.envType === 'string'
        ? resolved.envType
        : String(resolved.envType ?? ''),
      {
        prod: CmcEnvironmenType.PRODUCTION,
        production: CmcEnvironmenType.PRODUCTION,
        sandbox: CmcEnvironmenType.SANDBOX,
        dev: CmcEnvironmenType.SANDBOX,
        development: CmcEnvironmenType.SANDBOX,
      },
      CMC_ENV_TYPE,
    );

    const defaultSymbols = normalizeSymbols(resolved.defaultSymbols);
    const defaultFiat = normalizeFiat(resolved.defaultFiatCurrency);

    return {
      ...resolved,
      apiKey: resolved.apiKey?.trim?.() ?? '',
      envType,
      defaultSymbols,
      defaultFiatCurrency: defaultFiat,
    };
  },
);

function toSymbolList(value: string | string[]): string {
  if (Array.isArray(value)) {
    return value.map((s) => String(s).toUpperCase()).join(',');
  }
  return String(value).toUpperCase();
}

function normalizeSymbols(value?: string): string {
  const raw = value?.trim();
  if (raw) {
    return raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => s.toUpperCase())
      .join(',');
  }
  return FALLBACK_SYMBOLS;
}

function normalizeFiat(value?: string): string {
  const normalized = value?.trim();
  if (normalized && normalized.length > 0) {
    return normalized.toUpperCase();
  }
  return CMC_DEFAULT_FIAT_CURRENCY;
}
