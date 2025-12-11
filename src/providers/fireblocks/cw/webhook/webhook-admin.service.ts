import { Injectable, Logger } from '@nestjs/common';
import { FireblocksCwService } from '../fireblocks-cw.service';

@Injectable()
export class WebhookAdminService {
  private readonly logger = new Logger(WebhookAdminService.name);

  constructor(private readonly client: FireblocksCwService) {}

  async rotateWebhookSecret(): Promise<void> {
    this.logger.log('Rotating webhook secret');
    this.logger.debug(`Using environment ${this.client.getOptions().envType}`);
  }
}
