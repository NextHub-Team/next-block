import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../config/config.type';
import { FIREBLOCKS_CW_ENV_TYPE } from '../../providers/fireblocks/cw/types/fireblocks-const.type';
import { FireblocksEnvironmentType } from '../../providers/fireblocks/cw/types/fireblocks-enum.type';
import { SleevesEnvType } from '../types/sleeves-enum.type';

const FIREBLOCKS_TO_SLEEVES_ENV: Record<
  FireblocksEnvironmentType,
  SleevesEnvType
> = {
  [FireblocksEnvironmentType.SANDBOX]: SleevesEnvType.Testnet,
  [FireblocksEnvironmentType.PROD_US]: SleevesEnvType.Mainnet,
  [FireblocksEnvironmentType.PROD_EU]: SleevesEnvType.Mainnet,
  [FireblocksEnvironmentType.PROD_EU2]: SleevesEnvType.Mainnet,
};

export const mapFireblocksEnvToSleevesEnv = (
  envType: FireblocksEnvironmentType,
): SleevesEnvType => {
  return FIREBLOCKS_TO_SLEEVES_ENV[envType] ?? SleevesEnvType.Testnet;
};

export const getCurrentSleevesEnv = (
  configService?: ConfigService<AllConfigType>,
): SleevesEnvType => {
  const fireblocksEnv =
    configService?.get('fireblocks.envType', FIREBLOCKS_CW_ENV_TYPE, {
      infer: true,
    }) ?? FIREBLOCKS_CW_ENV_TYPE;

  return mapFireblocksEnvToSleevesEnv(fireblocksEnv);
};
