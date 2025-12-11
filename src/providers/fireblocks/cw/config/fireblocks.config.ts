import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { createToggleableConfig } from '../../../../config/config.helper';
import { mapEnvType } from '../../../../utils/helpers/env.helper';
import { FireblocksConfig } from './fireblocks-config.type';
import { FireblocksEnvironmentType } from '../types/fireblocks-enum.type';
import {
  FIREBLOCKS_API_KEY,
  FIREBLOCKS_ENABLE,
  FIREBLOCKS_ENV_TYPE,
  FIREBLOCKS_SECRET_KEY,
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
}

const defaults: FireblocksConfig = {
  enable: FIREBLOCKS_ENABLE,
  apiKey: FIREBLOCKS_API_KEY,
  secretKey: FIREBLOCKS_SECRET_KEY,
  envType: FIREBLOCKS_ENV_TYPE,
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
          prod: FireblocksEnvironmentType.PRODUCTION,
          production: FireblocksEnvironmentType.PRODUCTION,
          sandbox: FireblocksEnvironmentType.SANDBOX,
          dev: FireblocksEnvironmentType.SANDBOX,
          development: FireblocksEnvironmentType.SANDBOX,
        },
        defaults.envType,
      );

      return {
        apiKey: env.FIREBLOCKS_API_KEY ?? defaults.apiKey,
        secretKey: env.FIREBLOCKS_SECRET_KEY ?? defaults.secretKey,
        envType,
      } satisfies Partial<FireblocksConfig>;
    },
  },
);
