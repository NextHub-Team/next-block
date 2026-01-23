import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { createToggleableConfig, parseBool } from './config.helper';
import { AwsSecretsManagerConfig } from './types/aws-secrets-manager-config.type';
import {
  AWS_SECRETS_MANAGER_DEBUG,
  AWS_SECRETS_MANAGER_ENABLE,
  AWS_SECRETS_MANAGER_REGION,
  AWS_SECRETS_MANAGER_SECRET_IDS,
  AWS_SECRETS_MANAGER_SET_TO_ENV,
} from './types/aws-secrets-manager-const.type';

class EnvironmentVariablesValidator {
  @IsBoolean()
  @IsOptional()
  AWS_SECRETS_MANAGER_ENABLE: boolean;

  @IsString()
  AWS_SECRETS_MANAGER_REGION: string;

  @IsString()
  AWS_SECRETS_MANAGER_SECRET_IDS: string;

  @IsBoolean()
  @IsOptional()
  AWS_SECRETS_MANAGER_SET_TO_ENV: boolean;

  @IsBoolean()
  @IsOptional()
  AWS_SECRETS_MANAGER_DEBUG: boolean;
}

const defaults: AwsSecretsManagerConfig = {
  enable: AWS_SECRETS_MANAGER_ENABLE,
  region: AWS_SECRETS_MANAGER_REGION,
  secretIds: AWS_SECRETS_MANAGER_SECRET_IDS,
  setToEnv: AWS_SECRETS_MANAGER_SET_TO_ENV,
  debug: AWS_SECRETS_MANAGER_DEBUG,
};

function parseSecretIds(value?: string): string[] {
  if (!value) return defaults.secretIds;
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export default createToggleableConfig<
  AwsSecretsManagerConfig,
  EnvironmentVariablesValidator
>('awsSecretsManager', EnvironmentVariablesValidator, defaults, {
  enableKey: 'enable',
  enableEnvKey: 'AWS_SECRETS_MANAGER_ENABLE',
  mapEnabledConfig: (env) => ({
    region: env.AWS_SECRETS_MANAGER_REGION ?? defaults.region,
    secretIds: parseSecretIds(env.AWS_SECRETS_MANAGER_SECRET_IDS),
    setToEnv: env.AWS_SECRETS_MANAGER_SET_TO_ENV ?? defaults.setToEnv ?? true,
    debug: env.AWS_SECRETS_MANAGER_DEBUG ?? defaults.debug,
  }),
  mapDisabledConfig: () => ({
    secretIds: [],
  }),
});

export function buildAwsSecretsOptionsFromEnv(): AwsSecretsManagerConfig {
  return {
    enable: parseBool(
      process.env.AWS_SECRETS_MANAGER_ENABLE,
      AWS_SECRETS_MANAGER_ENABLE,
    ),
    region:
      process.env.AWS_SECRETS_MANAGER_REGION ?? AWS_SECRETS_MANAGER_REGION,
    secretIds: parseSecretIds(process.env.AWS_SECRETS_MANAGER_SECRET_IDS),
    setToEnv: parseBool(
      process.env.AWS_SECRETS_MANAGER_SET_TO_ENV,
      AWS_SECRETS_MANAGER_SET_TO_ENV,
    ),
    debug: parseBool(
      process.env.AWS_SECRETS_MANAGER_DEBUG,
      AWS_SECRETS_MANAGER_DEBUG,
    ),
  };
}
