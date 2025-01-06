import { registerAs } from '@nestjs/config';
import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { VeroConfig } from './vero-config.type';
import {
  BASE_VALUE_JWKS_URL,
  DEFAULT_JWKS_CACHE_MAX_AGE,
} from '../types/vero-const.type';
class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  VERO_JWKS_URL: string;

  @IsInt()
  @Min(3600000)
  @Max(1800000)
  @IsOptional()
  VERO_CACHE_MAX_AGE: number;
}

export default registerAs<VeroConfig>('vero', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  const jwksUri = process.env.VERO_JWKS_URL
    ? process.env.VERO_JWKS_URL
    : BASE_VALUE_JWKS_URL;

  const jwksUriCacheMaxAge = process.env.VERO_CACHE_MAX_AGE
    ? Number(process.env.VERO_CACHE_MAX_AGE)
    : DEFAULT_JWKS_CACHE_MAX_AGE;

  return {
    jwksUri,
    jwksUriCacheMaxAge,
  };
});
