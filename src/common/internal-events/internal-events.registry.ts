import { Injectable, Logger } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { INTERNAL_EVENT_HANDLER_METADATA } from './types/internal-events-constants.type';
import { InternalEvent } from '../../internal-events/domain/internal-event';

export type InternalEventHandlerInstance = {
  handle: (event: InternalEvent) => Promise<void> | void;
};

@Injectable()
export class InternalEventsRegistry {
  private readonly logger = new Logger(InternalEventsRegistry.name);
  private readonly handlers = new Map<string, InternalEventHandlerInstance[]>();

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}

  onModuleInit() {
    const providers = this.discoveryService.getProviders();
    providers.forEach((wrapper) => {
      const instance = wrapper.instance as InternalEventHandlerInstance | null;
      if (!instance) return;
      const eventType = this.reflector.get<string>(
        INTERNAL_EVENT_HANDLER_METADATA,
        instance.constructor,
      );
      if (!eventType) return;
      if (typeof instance.handle !== 'function') {
        this.logger.warn(
          `InternalEventHandler missing handle(): ${instance.constructor.name}`,
        );
        return;
      }
      const list = this.handlers.get(eventType) ?? [];
      list.push(instance);
      this.handlers.set(eventType, list);
    });
  }

  getHandlers(eventType: string): InternalEventHandlerInstance[] {
    return this.handlers.get(eventType) ?? [];
  }
}
