import { registerAs } from '@nestjs/config';
import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { LoggerConfig } from './logger.config';
import validateConfig from '../../../utils/validate-config';
import { NodeEnv } from '../../../utils/types/gobal.type';
import { booleanValidator } from '../../../utils/helpers/env.helper';

class LoggerEnvironmentValidator {
  @IsOptional()
  @IsString()
  LOG_LEVEL: string;

  @IsOptional()
  @IsBoolean()
  LOG_CONSOLE_ENABLED: boolean;

  @IsOptional()
  @IsBoolean()
  LOG_FILE_ENABLED: boolean;

  @IsOptional()
  @IsString()
  LOG_FILE_PATH?: string;

  @IsOptional()
  @IsBoolean()
  LOG_REMOTE_ENABLED: boolean;

  @IsOptional()
  @IsString()
  LOG_REMOTE_ENDPOINT?: string;

  @IsOptional()
  @IsString()
  LOG_CONTEXT?: string;
}

export default registerAs<LoggerConfig>('logger', (): LoggerConfig => {
  validateConfig(process.env, LoggerEnvironmentValidator);

  const nodeEnv = process.env.NODE_ENV || NodeEnv.DEVELOPMENT;
  const levelFromEnv = process.env.LOG_LEVEL;

  const defaultLogLevel =
    levelFromEnv && levelFromEnv !== 'auto'
      ? levelFromEnv
      : nodeEnv === NodeEnv.PRODUCTION
        ? 'info'
        : 'debug';

  return {
    level: defaultLogLevel,
    consoleEnabled: booleanValidator(process.env.LOG_CONSOLE_ENABLED, true),
    fileEnabled: booleanValidator(process.env.LOG_FILE_ENABLED, false),
    filePath: process.env.LOG_FILE_PATH || 'logs/app.log',
    remoteEnabled: booleanValidator(process.env.LOG_REMOTE_ENABLED, false),
    remoteEndpoint: process.env.LOG_REMOTE_ENDPOINT,
    context: process.env.LOG_CONTEXT || 'App',
  } as LoggerConfig;
});
