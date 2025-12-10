import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../../../../config/config.type';
import { FireblocksClientOptions } from '../../types/fireblocks-base.type';

@Injectable()
export class FireblocksClientProvider {
  private readonly logger = new Logger(FireblocksClientProvider.name);
  private readonly options: FireblocksClientOptions;

  constructor(private readonly configService: ConfigService<AllConfigType>) {
    this.options = {
      enable: this.configService.get('fireblocks.enable', { infer: true }) ?? false,
      apiKey: this.configService.getOrThrow('fireblocks.apiKey', { infer: true }),
      secretKey: this.configService.getOrThrow('fireblocks.secretKey', {
        infer: true,
      }),
      basePath: this.configService.get('fireblocks.basePath', { infer: true }) ?? '',
      envType: this.configService.getOrThrow('fireblocks.envType', { infer: true }),
    };
    this.logger.log(
      `Fireblocks client configured (env: ${this.options.envType}, basePath: ${this.options.basePath})`,
    );
  }

  getOptions(): FireblocksClientOptions {
    return this.options;
  }
}
