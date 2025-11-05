import { registerAs } from '@nestjs/config';
import { AppConfig } from './app-config.type';
import validateConfig from '.././utils/validate-config';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import appPkg from '../../package.json';
import { NodeEnv } from '../utils/types/gobal.type';
import {
  APP_DEFAULT_API_PREFIX,
  APP_DEFAULT_BACKEND_DOMAIN,
  APP_DEFAULT_DB_TYPE,
  APP_DEFAULT_DOCS_HOST,
  APP_DEFAULT_DOCS_PATH,
  APP_DEFAULT_FALLBACK_LANGUAGE,
  APP_DEFAULT_HEADER_LANGUAGE,
  APP_DEFAULT_MONITOR_SAMPLE_MS,
  APP_DEFAULT_NAME,
  APP_DEFAULT_PORT,
} from './types/app-const.type';

class EnvironmentVariablesValidator {
  @IsEnum(NodeEnv)
  @IsOptional()
  NODE_ENV: NodeEnv;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  APP_PORT: number;

  @IsUrl({ require_tld: false })
  @IsOptional()
  FRONTEND_DOMAIN: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  BACKEND_DOMAIN: string;

  @IsString()
  @IsOptional()
  API_PREFIX: string;

  @IsString()
  @IsOptional()
  APP_FALLBACK_LANGUAGE: string;

  @IsString()
  @IsOptional()
  APP_HEADER_LANGUAGE: string;

  @IsString()
  @IsOptional()
  APP_VERSION: string;

  @IsString()
  @IsOptional()
  DATABASE_TYPE: string;

  @IsString()
  @IsOptional()
  DOCS_URL: string;
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);
  const _port = process.env.APP_PORT
    ? parseInt(process.env.APP_PORT, 10)
    : process.env.PORT
      ? parseInt(process.env.PORT, 10)
      : APP_DEFAULT_PORT;
  return {
    nodeEnv: process.env.NODE_ENV || NodeEnv.DEVELOPMENT,
    name: process.env.APP_NAME || APP_DEFAULT_NAME,
    version: process.env.APP_VERSION || (appPkg as any).version,
    workingDirectory: process.env.PWD || process.cwd(),
    frontendDomain: process.env.FRONTEND_DOMAIN,
    backendDomain:
      process.env.BACKEND_DOMAIN ?? APP_DEFAULT_BACKEND_DOMAIN,
    port: _port,
    apiPrefix: process.env.API_PREFIX || APP_DEFAULT_API_PREFIX,
    fallbackLanguage:
      process.env.APP_FALLBACK_LANGUAGE || APP_DEFAULT_FALLBACK_LANGUAGE,
    headerLanguage:
      process.env.APP_HEADER_LANGUAGE || APP_DEFAULT_HEADER_LANGUAGE,
    dbType: process.env.DATABASE_TYPE || APP_DEFAULT_DB_TYPE,
    monitorSampleMs: process.env.MONITOR_SAMPLE_MS
      ? parseInt(process.env.MONITOR_SAMPLE_MS, 10)
      : APP_DEFAULT_MONITOR_SAMPLE_MS,
    docsUrl:
      process.env.DOCS_URL ||
      `${APP_DEFAULT_DOCS_HOST}:${_port}${APP_DEFAULT_DOCS_PATH}`,
  };
});
