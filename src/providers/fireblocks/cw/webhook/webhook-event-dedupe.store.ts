import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WebhookEventDedupeStore {
  private readonly logger = new Logger(WebhookEventDedupeStore.name);
  private readonly seen = new Set<string>();

  hasProcessed(eventId: string): boolean {
    if (this.seen.has(eventId)) {
      this.logger.debug(`Duplicate webhook detected: ${eventId}`);
    }
    return this.seen.has(eventId);
  }

  markProcessed(eventId: string): void {
    this.logger.log(`Marking webhook ${eventId} as processed`);
    this.seen.add(eventId);
  }
}
