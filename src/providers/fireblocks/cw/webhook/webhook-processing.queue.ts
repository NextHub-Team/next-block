import { Injectable, Logger } from '@nestjs/common';
import { FireblocksWebhookEnvelope } from './webhook-event-router';

@Injectable()
export class WebhookProcessingQueue {
  private readonly logger = new Logger(WebhookProcessingQueue.name);

  // eslint-disable-next-line @typescript-eslint/require-await
  async enqueue(event: FireblocksWebhookEnvelope): Promise<void> {
    this.logger.debug(`Enqueued webhook ${event.id} of type ${event.type}`);
  }
}
