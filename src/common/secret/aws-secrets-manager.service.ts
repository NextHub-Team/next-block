import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AWSSecretsManagerModuleOptions,
  AWSSecretsService,
} from 'nestjs-aws-secrets-manager';
import { AllConfigType } from 'src/config/config.type';
import { AwsSecretsManagerConfig } from 'src/config/types/aws-secrets-manager-config.type';
import { BaseToggleableService } from '../base/base-toggleable.service';
import { buildAwsSecretsOptionsFromEnv } from 'src/config/aws-secrets-manager.config';

@Injectable()
export class AwsSecretsManagerService
  extends BaseToggleableService
{
  private readonly secretsConfig: AwsSecretsManagerConfig;

  constructor(private readonly configService: ConfigService<AllConfigType>) {
    const config =
      configService.get<AwsSecretsManagerConfig>('awsSecretsManager', {
        infer: true,
      }) ?? buildAwsSecretsOptionsFromEnv();

    super(AwsSecretsManagerService.name, config.enable);
    this.secretsConfig = config;
  }

  get config(): AwsSecretsManagerConfig {
    return { ...this.secretsConfig };
  }

  async syncSecretsToEnv(context = 'Bootstrap'): Promise<void> {
    this.checkIfEnabled();
    const options = this.buildOptions();

    if (!options.secretsSource || options.secretsSource.length === 0) {
      this.logger.warn(
        `${context}: No secret identifiers configured. Skipping AWS Secrets pull.`,
      );
      return;
    }

    if (!this.secretsConfig.region) {
      this.logger.warn(
        `${context}: AWS region is not configured. Skipping AWS Secrets pull.`,
      );
      return;
    }

    this.logger.log(
      `${context}: Fetching AWS secrets (${this.describeSecrets(options.secretsSource)}) to populate environment variables...`,
    );

    const secretsService = new AWSSecretsService(options);
    await secretsService.setAllSecrectToEnv();

    this.logger.log(
      `${context}: AWS secrets loaded into process.env and ready for ConfigService consumers.`,
    );
  }

  async getSecretsById<T>(secretId: string): Promise<T> {
    this.checkIfEnabled();
    const secretsService = new AWSSecretsService(this.buildOptions());
    return secretsService.getSecretsByID<T>(secretId);
  }

  private buildOptions(): AWSSecretsManagerModuleOptions {
    return {
      secretsManager: new SecretsManagerClient({
        region: this.secretsConfig.region,
      }),
      isSetToEnv: this.secretsConfig.setToEnv,
      secretsSource:
        this.secretsConfig.secretIds.length === 1
          ? this.secretsConfig.secretIds[0]
          : this.secretsConfig.secretIds,
      isDebug: this.secretsConfig.debug,
    };
  }

  private describeSecrets(source: string | string[]): string {
    return Array.isArray(source) ? source.join(', ') : source;
  }
}
