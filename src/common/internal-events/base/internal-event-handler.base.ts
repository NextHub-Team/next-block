import { Logger } from '@nestjs/common';
import { InternalEvent } from '../../../internal-events/domain/internal-event';

export abstract class InternalEventHandlerBase {
  protected readonly logger: Logger;

  protected constructor(context: string) {
    this.logger = new Logger(context);
  }

  protected id(event: InternalEvent): string {
    return event.eventId ?? event.id ?? 'unknown';
  }

  protected received(
    event: InternalEvent,
    id: string,
    payload?: unknown,
    debugLogging = false,
  ) {
    if (debugLogging) {
      const payloadText = this.stringifyPayload(payload);
      this.logger.debug(
        `Internal event received: [EVENT:${event.eventType}] [ID:${id}] PAYLOAD:${payloadText}`,
      );
      return;
    }

    this.logger.log(
      `Internal event received: [EVENT:${event.eventType}] [ID:${id}]`,
    );
  }

  protected processed(event: InternalEvent, id: string) {
    this.logger.log(
      `Internal event processed: [EVENT:${event.eventType}] [ID:${id}]`,
    );
  }

  protected failed(event: InternalEvent, id: string, error: unknown): never {
    const message = (error as Error)?.message ?? String(error);
    this.logger.error(
      `Internal event failed: [EVENT:${event.eventType}] [ID:${id}] MSG:${message}`,
      (error as Error)?.stack,
    );
    throw error as Error;
  }

  private stringifyPayload(payload: unknown): string {
    try {
      return JSON.stringify(payload);
    } catch (error) {
      const message = (error as Error)?.message ?? 'stringify_failed';
      return `{error:"${message}"}`;
    }
  }
}
