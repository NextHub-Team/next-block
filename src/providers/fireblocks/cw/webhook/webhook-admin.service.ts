import { Injectable, Logger } from '@nestjs/common';
import { FireblocksClientService } from '../core/shared/fireblocks-client.service';

@Injectable()
export class WebhookAdminService {
  private readonly logger = new Logger(WebhookAdminService.name);

  constructor(private readonly client: FireblocksClientService) {}

  async rotateWebhookSecret(): Promise<void> {
    this.logger.log('Rotating webhook secret');
    this.logger.debug(`Using basePath ${this.client.getOptions().basePath}`);
  }
}
