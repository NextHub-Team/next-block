import { Injectable, Logger } from '@nestjs/common';
import { WebhookProcessingQueue } from './webhook-processing.queue';
import { WebhookEventDedupeStore } from './webhook-event-dedupe.store';

export interface FireblocksWebhookEnvelope {
  id: string;
  type: string;
  payload: unknown;
}

@Injectable()
export class WebhookEventRouter {
  private readonly logger = new Logger(WebhookEventRouter.name);

  constructor(
    private readonly queue: WebhookProcessingQueue,
    private readonly dedupe: WebhookEventDedupeStore,
  ) {}

  async route(event: FireblocksWebhookEnvelope): Promise<void> {
    if (this.dedupe.hasProcessed(event.id)) {
      this.logger.debug(`Skipping duplicate webhook ${event.id}`);
      return;
    }

    await this.queue.enqueue(event);
    this.dedupe.markProcessed(event.id);
  }
}
