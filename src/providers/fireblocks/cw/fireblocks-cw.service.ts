import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { Fireblocks } from '@fireblocks/ts-sdk';
import { AllConfigType } from '../../../config/config.type';
import { getFireblocksBaseUrl } from './helpers/fireblocks-cw.helper';
import { FireblocksClientOptions } from './types/fireblocks-base.type';
import { FireblocksCwAdminService } from './services/fireblocks-cw-admin.service';
import { FireblocksCwClientService } from './services/fireblocks-cw-client.service';
import { UsersService } from '../../../users/users.service';
import {
  FIREBLOCKS_ENABLE,
  FIREBLOCKS_ENV_TYPE,
  FIREBLOCKS_CIRCUIT_BREAKER_FAILURE_THRESHOLD,
  FIREBLOCKS_CIRCUIT_BREAKER_HALF_OPEN_SAMPLE,
  FIREBLOCKS_CIRCUIT_BREAKER_RESET_TIMEOUT_MS,
  FIREBLOCKS_DEBUG_LOGGING,
  FIREBLOCKS_MAX_RETRIES,
  FIREBLOCKS_RATE_LIMIT_INTERVAL_MS,
  FIREBLOCKS_RATE_LIMIT_TOKENS_PER_INTERVAL,
  FIREBLOCKS_REQUEST_TIMEOUT_MS,
  FIREBLOCKS_VAULT_NAME_PREFIX,
} from './types/fireblocks-const.type';
import { BaseToggleableService } from '../../../common/base/base-toggleable.service';

@Injectable()
export class FireblocksCwService
  extends BaseToggleableService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly options: FireblocksClientOptions;
  private fireblocksSdk?: Fireblocks;
  public admin!: FireblocksCwAdminService;
  public client!: FireblocksCwClientService;

  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly moduleRef: ModuleRef,
    private readonly usersService: UsersService,
  ) {
    super(
      FireblocksCwService.name,
      configService.get('fireblocks.enable', FIREBLOCKS_ENABLE, {
        infer: true,
      }),
    );
    this.options = this.resolveOptions();
    this.logger.log(
      `Fireblocks client configured (env: ${this.options.envType})`,
    );
  }

  async onModuleInit(): Promise<void> {
    if (!this.isEnabled) {
      this.logger.warn(
        'Fireblocks CW service is DISABLED. Skipping initialization.',
      );
      return;
    }

    this.logger.log('Initializing Fireblocks CW services...');
    this.admin = this.moduleRef.get(FireblocksCwAdminService, {
      strict: false,
    });
    this.client = this.moduleRef.get(FireblocksCwClientService, {
      strict: false,
    });

    await this.initializeSdk();
    await this.checkConnection();
  }

  async onModuleDestroy(): Promise<void> {
    if (!this.fireblocksSdk) {
      this.logger.log('Fireblocks SDK not initialized; skipping teardown.');
      return;
    }

    await this.teardownSdk();
  }

  getOptions(): FireblocksClientOptions {
    return this.options;
  }

  public isReady(): boolean {
    this.checkIfEnabled();
    if (!this.fireblocksSdk) {
      this.logger.error(
        'Fireblocks SDK has not been initialized or is disabled.',
      );
      throw new ServiceUnavailableException(
        'Fireblocks SDK is not initialized.',
      );
    }
    return true;
  }

  getSdk(): Fireblocks {
    if (!this.fireblocksSdk) {
      this.logger.error(
        'Fireblocks SDK has not been initialized or is disabled.',
      );
      throw new Error('Fireblocks SDK has not been initialized');
    }
    return this.fireblocksSdk;
  }

  async buildVaultName(
    userId: number | string,
    fallbackProviderId?: string | null,
  ): Promise<string> {
    const user = await this.usersService.findById(userId);
    const suffix = user?.socialId ?? fallbackProviderId ?? userId;
    const configuredPrefix =
      (this.options.vaultNamePrefix ?? FIREBLOCKS_VAULT_NAME_PREFIX) || '';
    const basePrefix =
      configuredPrefix.trim().length > 0
        ? configuredPrefix.trim()
        : FIREBLOCKS_VAULT_NAME_PREFIX;
    const normalizedPrefix = basePrefix.endsWith(':')
      ? basePrefix
      : `${basePrefix}:`;
    return `${normalizedPrefix}${suffix}`;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  private async initializeSdk(): Promise<void> {
    this.logger.log('Starting Fireblocks SDK initialization (async mode)...');
    const baseUrl = getFireblocksBaseUrl(this.options.envType);

    try {
      this.fireblocksSdk = new Fireblocks({
        apiKey: this.options.apiKey,
        secretKey: this.options.secretKey,
        basePath: baseUrl,
        additionalOptions: {
          baseOptions: {
            timeout: this.options.requestTimeoutMs,
          },
          userAgent: `${APP.name}`,
        },
      });

      this.logger.log(
        `Fireblocks SDK initialized successfully (base URL: ${baseUrl}).`,
      );
    } catch (error: unknown) {
      this.fireblocksSdk = undefined;
      this.logger.error(
        'Failed to initialize Fireblocks SDK.',
        error instanceof Error ? error.stack : `${error}`,
      );
      throw error;
    }
  }

  private async checkConnection(): Promise<void> {
    if (!this.fireblocksSdk) return;

    try {
      const data = await this.fireblocksSdk.web3Connections.get(); // Simple call to verify connectivity
      const status = data.statusCode;
      this.logger.log(`Fireblocks health check OK (status: ${status}).`);
    } catch (error: unknown) {
      const ok = this.isOkErrorResponse(error);
      if (ok.isOk) {
        this.logger.log(
          `Fireblocks health check OK (status: ${ok.status ?? 'unknown'}).`,
        );
        return;
      }
      const message = this.formatError(error);
      this.logger.warn(`Fireblocks connectivity check failed: ${message}`);
    }
  }

  private async teardownSdk(): Promise<void> {
    const sdk = this.fireblocksSdk;
    this.fireblocksSdk = undefined;

    if (!sdk) {
      return;
    }

    this.logger.log('Tearing down Fireblocks SDK resources...');

    const closableSdk = sdk as unknown as {
      close?: () => Promise<void> | void;
      destroy?: () => Promise<void> | void;
    };

    try {
      if (typeof closableSdk.close === 'function') {
        await closableSdk.close();
        this.logger.log(
          'Fireblocks SDK close() called to release pooled resources.',
        );
      } else if (typeof closableSdk.destroy === 'function') {
        await closableSdk.destroy();
        this.logger.log(
          'Fireblocks SDK destroy() called to release pooled resources.',
        );
      } else {
        this.logger.log(
          'Fireblocks SDK does not expose explicit teardown hooks; reference cleared for GC.',
        );
      }
    } catch (error: unknown) {
      this.logger.error(
        'Error encountered while shutting down Fireblocks SDK resources.',
        error instanceof Error ? error.stack : `${error}`,
      );
    }
  }

  private resolveOptions(): FireblocksClientOptions {
    const enable = this.configService.get(
      'fireblocks.enable',
      FIREBLOCKS_ENABLE,
      {
        infer: true,
      },
    );
    const envType = this.configService.get(
      'fireblocks.envType',
      FIREBLOCKS_ENV_TYPE,
      {
        infer: true,
      },
    );
    const vaultNamePrefix =
      this.configService.get<string>(
        'fireblocks.vaultNamePrefix',
        FIREBLOCKS_VAULT_NAME_PREFIX,
        { infer: true },
      ) ?? FIREBLOCKS_VAULT_NAME_PREFIX;

    if (!enable) {
      return {
        enable,
        apiKey: '',
        secretKey: '',
        envType,
        requestTimeoutMs: FIREBLOCKS_REQUEST_TIMEOUT_MS,
        maxRetries: FIREBLOCKS_MAX_RETRIES,
        circuitBreaker: {
          failureThreshold: FIREBLOCKS_CIRCUIT_BREAKER_FAILURE_THRESHOLD,
          resetTimeoutMs: FIREBLOCKS_CIRCUIT_BREAKER_RESET_TIMEOUT_MS,
          halfOpenSample: FIREBLOCKS_CIRCUIT_BREAKER_HALF_OPEN_SAMPLE,
        },
        rateLimit: {
          tokensPerInterval: FIREBLOCKS_RATE_LIMIT_TOKENS_PER_INTERVAL,
          intervalMs: FIREBLOCKS_RATE_LIMIT_INTERVAL_MS,
        },
        debugLogging: FIREBLOCKS_DEBUG_LOGGING,
        vaultNamePrefix,
      } satisfies FireblocksClientOptions;
    }

    const fireblocksConfig = this.configService.getOrThrow('fireblocks', {
      infer: true,
    });
    const secretKey = this.normalizeSecretKey(fireblocksConfig.secretKey);

    return {
      enable,
      apiKey: fireblocksConfig.apiKey,
      secretKey,
      envType: fireblocksConfig.envType,
      requestTimeoutMs: fireblocksConfig.requestTimeoutMs,
      maxRetries: fireblocksConfig.maxRetries,
      circuitBreaker: fireblocksConfig.circuitBreaker,
      rateLimit: fireblocksConfig.rateLimit,
      debugLogging: fireblocksConfig.debugLogging,
      vaultNamePrefix: fireblocksConfig.vaultNamePrefix,
    } satisfies FireblocksClientOptions;
  }

  /**
   * Normalize PEM strings that are provided via environment variables.
   * Many setups store the key on a single line using escaped newlines,
   * which must be converted back before passing to JWT.
   */
  private normalizeSecretKey(secretKey: string): string {
    if (!secretKey) return secretKey;
    return secretKey.includes('\\n')
      ? secretKey.replace(/\\n/g, '\n')
      : secretKey;
  }

  /**
   * Format SDK or HTTP errors so we log a helpful message instead of [object Object].
   */
  private formatError(error: unknown): string {
    if (!error) return 'Unknown error';

    if (error instanceof Error) {
      const response = (error as any).response;
      const status =
        response?.status ?? response?.statusCode ?? (error as any).status;
      const code = (error as any).code;
      const data = response?.data ?? (error as any).data;
      const parts: string[] = [error.message];
      if (status) parts.push(`status=${status}`);
      if (code) parts.push(`code=${code}`);
      if (data) {
        try {
          parts.push(`data=${JSON.stringify(data)}`);
        } catch {
          parts.push(`data=${String(data)}`);
        }
      }
      return parts.filter(Boolean).join(' | ');
    }

    if (typeof error === 'object') {
      const anyError = error as Record<string, any>;
      const response = anyError.response;
      const status =
        response?.status ??
        response?.statusCode ??
        anyError.status ??
        anyError.statusCode;
      const code = anyError.code ?? anyError.errorCode;
      const msg = anyError.message ?? anyError.error ?? anyError.title;
      const data = response?.data ?? anyError.data ?? anyError.body;
      const parts: string[] = [];
      if (msg) parts.push(String(msg));
      if (status) parts.push(`status=${status}`);
      if (code) parts.push(`code=${code}`);
      if (data) {
        try {
          parts.push(`data=${JSON.stringify(data)}`);
        } catch {
          parts.push(`data=${String(data)}`);
        }
      }
      if (parts.length) return parts.join(' | ');
      try {
        return JSON.stringify(error);
      } catch {
        return `${error}`;
      }
    }

    return String(error);
  }

  /**
   * Some Fireblocks SDK errors wrap a response with { message: 'ok', code: 0 }.
   * Only treat that as success if the HTTP status is < 400 (or missing).
   */
  private isOkErrorResponse(error: unknown): {
    isOk: boolean;
    status?: number;
  } {
    if (!error || typeof error !== 'object') return { isOk: false };
    const response = (error as any).response;
    const data = response?.data ?? (error as any).data;
    const status =
      response?.status ??
      response?.statusCode ??
      (response?.data?.status as any);

    if (
      (status === undefined || (typeof status === 'number' && status < 400)) &&
      data?.message === 'ok' &&
      (data?.code === 0 || data?.status === 'ok')
    ) {
      return { isOk: true, status };
    }

    return { isOk: false, status };
  }
}
