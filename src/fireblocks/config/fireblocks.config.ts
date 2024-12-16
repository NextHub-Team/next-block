import { registerAs } from '@nestjs/config';

import { IsString, IsOptional } from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { FireblocksConfig } from './fireblocks-config.type';

class FireblocksEnvironmentValidator {
  @IsString()
  FIREBLOCKS_API_SECRET: string;

  @IsString()
  FIREBLOCKS_API_KEY_NCW_ADMIN: string;

  @IsString()
  @IsOptional()
  FIREBLOCKS_API_BASE_URL: string;
}

export default registerAs<FireblocksConfig>('fireblocks', () => {
  validateConfig(process.env, FireblocksEnvironmentValidator);

  return {
    apiSecret: process.env.FIREBLOCKS_API_SECRET || '',
    apiKey: process.env.FIREBLOCKS_API_KEY_NCW_ADMIN || '',
    baseUrl: process.env.FIREBLOCKS_API_BASE_URL || 'https://api.fireblocks.io',
  };
});
