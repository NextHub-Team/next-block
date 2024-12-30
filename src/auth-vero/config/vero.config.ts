import { registerAs } from '@nestjs/config';
import { IsOptional, IsString, IsNumber } from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { VeroConfig } from './vero-config.type';

class EnvironmentVariablesValidator {
  static BASE_VALUE_JWKS_URL: string =
    'https://gateway.veroapi.com/veritas/jwks';
  static DEFAULT_CACHE_MAX_AGE: number = 3600000; // Default 1 hour in ms

  @IsString()
  @IsOptional()
  VERO_JWKS_URL: string;

  @IsNumber()
  @IsOptional()
  VERO_CACHE_MAX_AGE: number;
}

export default registerAs<VeroConfig>('vero', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  const jwksUrl = process.env.VERO_JWKS_URL
    ? process.env.VERO_JWKS_URL
    : EnvironmentVariablesValidator.BASE_VALUE_JWKS_URL;

  const cacheMaxAge = process.env.VERO_CACHE_MAX_AGE
    ? Number(process.env.VERO_CACHE_MAX_AGE)
    : EnvironmentVariablesValidator.DEFAULT_CACHE_MAX_AGE;

  return {
    jwksUrl,
    cacheMaxAge,
  };
});
