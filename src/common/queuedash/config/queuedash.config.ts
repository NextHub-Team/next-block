import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { createToggleableConfig } from '../../../config/config.helper';
import { QueueDashConfig } from './queuedash-config.type';

class QueueDashEnvironmentVariablesValidator {
  @IsBoolean()
  @IsOptional()
  QUEUEDASH_ENABLE?: boolean;

  @IsString()
  @IsOptional()
  QUEUEDASH_PATH?: string;

  @IsBoolean()
  @IsOptional()
  QUEUEDASH_ALLOW_BATCHING?: boolean;

  @IsBoolean()
  @IsOptional()
  QUEUEDASH_LOG_REQUESTS?: boolean;
}

const defaults: QueueDashConfig = {
  enable: process.env.NODE_ENV !== 'production',
  path: 'queuedash',
  allowBatching: true,
  logRequests: process.env.NODE_ENV !== 'production',
};

export default createToggleableConfig<
  QueueDashConfig,
  QueueDashEnvironmentVariablesValidator
>('queuedash', QueueDashEnvironmentVariablesValidator, defaults, {
  enableKey: 'enable',
  enableEnvKey: 'QUEUEDASH_ENABLE',
  mapEnabledConfig: (env) => {
    return {
      path: env.QUEUEDASH_PATH ?? defaults.path,
      allowBatching: env.QUEUEDASH_ALLOW_BATCHING ?? defaults.allowBatching,
      logRequests: env.QUEUEDASH_LOG_REQUESTS ?? defaults.logRequests,
    } satisfies Partial<QueueDashConfig>;
  },
});
