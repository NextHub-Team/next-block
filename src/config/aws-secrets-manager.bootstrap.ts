import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { Logger } from '@nestjs/common';
import {
  AWSSecretsManagerModuleOptions,
  AWSSecretsService,
} from 'nestjs-aws-secrets-manager';
import { NodeEnv } from 'src/utils/types/gobal.type';
import { buildAwsSecretsOptionsFromEnv } from './aws-secrets-manager.config';

export async function bootstrapAwsSecrets(): Promise<void> {
  const logger = new Logger('AwsSecretsBootstrap');
  const config = buildAwsSecretsOptionsFromEnv();
  const nodeEnv = process.env.NODE_ENV || NodeEnv.DEVELOPMENT;

  if (!config.enable) {
    logger.log('AWS Secrets Manager bootstrap disabled.');
    return;
  }

  if (nodeEnv !== NodeEnv.PRODUCTION) {
    logger.log(`AWS Secrets Manager bootstrap skipped for ${nodeEnv} environment.`);
    return;
  }

  const source =
    config.secretIds.length === 1 ? config.secretIds[0] : config.secretIds;
  if (!source || (Array.isArray(source) && source.length === 0)) {
    logger.warn('AWS Secrets Manager bootstrap missing secret identifiers.');
    return;
  }

  if (!config.region) {
    logger.warn('AWS Secrets Manager bootstrap missing AWS region configuration.');
    return;
  }

  const options: AWSSecretsManagerModuleOptions = {
    secretsManager: new SecretsManagerClient({ region: config.region }),
    isSetToEnv: config.setToEnv,
    secretsSource: source,
    isDebug: config.debug,
  };

  logger.log(
    `Preloading AWS secrets (${Array.isArray(source) ? source.join(', ') : source}) before Nest application bootstrap...`,
  );

  try {
    const secretsService = new AWSSecretsService(options);
    await secretsService.setAllSecrectToEnv();
    logger.log('AWS secrets loaded into environment variables.');
  } catch (error) {
    logger.error(`Failed to preload AWS secrets: ${(error as Error).message}`);
    throw error;
  }
}
