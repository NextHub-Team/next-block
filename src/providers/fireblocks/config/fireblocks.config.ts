import { registerAs } from '@nestjs/config';
import { IsString, IsOptional } from 'class-validator';
import { FireblocksConfig } from './fireblocks-config.type';
import validateConfig from '../../../utils/validate-config';
import { FIREBLOCKS_DEFAULT_ENV } from '../types/fireblocks-const.type';

// Validator class for environment variables
class FireblocksEnvironmentValidator {
  @IsString()
  @IsOptional()
  SECRET_FIREBLOCKS_API_KEY_NCW_ADMIN: string;

  @IsString()
  @IsOptional()
  FIREBLOCKS_ENV_MODE: string;

  @IsString()
  @IsOptional()
  SECRET_FIREBLOCKS_API_KEY_NCW_SIGNER: string;

  @IsString()
  SECRET_FIREBLOCKS_API_KEY_ADMIN: string;

  @IsString()
  @IsOptional()
  SECRET_FIREBLOCKS_WEBHOOK_PUBLIC_KEY: string;
}

export default registerAs<FireblocksConfig>('fireblocks', () => {
  // Validate and transform the environment variables
  const validatedEnv = validateConfig(
    process.env,
    FireblocksEnvironmentValidator,
  );

  // Return the validated configuration
  return {
    apiKeyNcwAdmin: validatedEnv.SECRET_FIREBLOCKS_API_KEY_NCW_ADMIN || '',
    envMode: validatedEnv.FIREBLOCKS_ENV_MODE || FIREBLOCKS_DEFAULT_ENV,
    apiKeySigner: validatedEnv.SECRET_FIREBLOCKS_API_KEY_NCW_SIGNER || '',
    apiKeyAdmin: validatedEnv.SECRET_FIREBLOCKS_API_KEY_ADMIN,
    webhookPublicKey: validatedEnv.SECRET_FIREBLOCKS_WEBHOOK_PUBLIC_KEY || '',
  };
});
