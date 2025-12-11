import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { Fireblocks } from '@fireblocks/ts-sdk';
import { AllConfigType } from '../../../config/config.type';
import { getFireblocksBaseUrl } from './helpers/fireblocks-cw.helper';
import { FireblocksClientOptions } from './types/fireblocks-base.type';
import { CwAdminService } from './core/base/cw-admin.service';
import { CwClientService } from './core/base/cw-client.service';
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
} from './types/fireblocks-const.type';

@Injectable()
export class FireblocksCwService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(FireblocksCwService.name);
  private readonly options: FireblocksClientOptions;
  private fireblocksSdk?: Fireblocks;
  public admin!: CwAdminService;
  public client!: CwClientService;

  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly moduleRef: ModuleRef,
  ) {
    this.options = this.resolveOptions();
    this.logger.log(`Fireblocks client configured (env: ${this.options.envType})`);
  }

  async onModuleInit(): Promise<void> {
    this.logger.log('Initializing Fireblocks CW services...');
    this.admin = this.moduleRef.get(CwAdminService, { strict: false });
    this.client = this.moduleRef.get(CwClientService, { strict: false });

    if (!this.options.enable) {
      this.logger.warn('Fireblocks client is disabled via configuration.');
      return;
    }

    await this.initializeSdk();
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

  isEnabled(): boolean {
    return this.options.enable;
  }

  getSdk(): Fireblocks {
    if (!this.fireblocksSdk) {
      this.logger.error('Fireblocks SDK has not been initialized or is disabled.');
      throw new Error('Fireblocks SDK has not been initialized');
    }

    return this.fireblocksSdk;
  }

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
          userAgent: 'next-block-fireblocks-cw',
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
        this.logger.log('Fireblocks SDK close() called to release pooled resources.');
      } else if (typeof closableSdk.destroy === 'function') {
        await closableSdk.destroy();
        this.logger.log('Fireblocks SDK destroy() called to release pooled resources.');
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
    const enable = this.configService.get('fireblocks.enable', FIREBLOCKS_ENABLE, {
      infer: true,
    });
    const envType = this.configService.get('fireblocks.envType', FIREBLOCKS_ENV_TYPE, {
      infer: true,
    });

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
      } satisfies FireblocksClientOptions;
    }

    return {
      enable,
      apiKey: this.configService.getOrThrow('fireblocks.apiKey', { infer: true }),
      secretKey: this.configService.getOrThrow('fireblocks.secretKey', { infer: true }),
      envType: this.configService.getOrThrow('fireblocks.envType', { infer: true }),
      requestTimeoutMs: this.configService.getOrThrow('fireblocks.requestTimeoutMs', {
        infer: true,
      }),
      maxRetries: this.configService.getOrThrow('fireblocks.maxRetries', { infer: true }),
      circuitBreaker: this.configService.getOrThrow('fireblocks.circuitBreaker', {
        infer: true,
      }),
      rateLimit: this.configService.getOrThrow('fireblocks.rateLimit', { infer: true }),
      debugLogging: this.configService.getOrThrow('fireblocks.debugLogging', {
        infer: true,
      }),
    } satisfies FireblocksClientOptions;
  }
}
