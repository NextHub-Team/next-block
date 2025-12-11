import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../../../../config/config.type';
import { FIREBLOCKS_ENV_TYPE } from '../../types/fireblocks-const.type';

export abstract class AbstractCwService {
  protected readonly logger: Logger;

  protected constructor(
    context: string,
    protected readonly configService?: ConfigService<AllConfigType>,
  ) {
    this.logger = new Logger(context);
  }

  protected log(message: string): void {
    this.logger.log(message);
  }

  protected debug(message: string): void {
    this.logger.debug(message);
  }

  protected debugEnvironment(): void {
    if (!this.configService) {
      this.debug('Config service unavailable; environment not configured.');
      return;
    }

    const envType = this.configService.get('fireblocks.envType', FIREBLOCKS_ENV_TYPE, {
      infer: true,
    });
    this.debug(`Using environment ${envType}`);
  }
}
