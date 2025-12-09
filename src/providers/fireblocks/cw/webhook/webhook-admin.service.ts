import { Injectable, Logger } from '@nestjs/common';
import { FireblocksClientProvider } from '../core/providers/fireblocks-client.provider';

@Injectable()
export class WebhookAdminService {
  private readonly logger = new Logger(WebhookAdminService.name);

  constructor(private readonly client: FireblocksClientProvider) {}

  async resendFailedNotifications(): Promise<void> {
    this.logger.log('Resend failed webhook notifications (stub)');
    this.logger.debug(`Using basePath ${this.client.getOptions().basePath}`);
  }

  async getNotificationAttempts(eventId: string): Promise<void> {
    this.logger.log(`Get webhook attempts for ${eventId} (stub)`);
  }
}
