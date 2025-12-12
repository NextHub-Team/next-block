import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { Logger } from '@nestjs/common';

export interface AwsSecretsManagerOptions {
  secretsManager: SecretsManagerClient;
  secretsSource?: string | string[];
  isSetToEnv?: boolean;
  isDebug?: boolean;
}

export class AwsSecretsManagerClient {
  private readonly logger = new Logger(AwsSecretsManagerClient.name);

  constructor(private readonly options: AwsSecretsManagerOptions) {}

  async setAllSecretsToEnv(): Promise<void> {
    const sources = this.normalizeSources();
    if (sources.length === 0) return;

    for (const secretId of sources) {
      const secret =
        await this.getSecretsByID<Record<string, unknown>>(secretId);
      if (!this.options.isSetToEnv) continue;

      if (secret && typeof secret === 'object') {
        Object.entries(secret).forEach(([key, value]) => {
          const stringValue = value?.toString();
          if (stringValue === undefined) return;
          process.env[key] = stringValue;
          if (this.options.isDebug) {
            this.logger.debug(`Set env ${key} from secret ${secretId}`);
          }
        });
      } else if (this.options.isDebug) {
        this.logger.debug(
          `Secret ${secretId} is not an object and was not applied to env.`,
        );
      }
    }
  }

  async getSecretsByID<T>(secretId: string): Promise<T> {
    const response = await this.options.secretsManager.send(
      new GetSecretValueCommand({ SecretId: secretId }),
    );

    const secretValue =
      response.SecretString ??
      (response.SecretBinary
        ? Buffer.from(response.SecretBinary).toString('utf-8')
        : undefined);

    if (secretValue === undefined) {
      throw new Error(`Secret ${secretId} returned no data.`);
    }

    try {
      return JSON.parse(secretValue) as T;
    } catch (error) {
      if (this.options.isDebug) {
        this.logger.debug(
          `Secret ${secretId} is not JSON. Returning raw string. Error: ${(error as Error).message}`,
        );
      }
      return secretValue as unknown as T;
    }
  }

  private normalizeSources(): string[] {
    const { secretsSource } = this.options;
    if (!secretsSource) return [];
    return Array.isArray(secretsSource) ? secretsSource : [secretsSource];
  }
}
