import { SetMetadata } from '@nestjs/common';
import { INTERNAL_EVENT_HANDLER_METADATA } from '../types/internal-events.constants';

export function InternalEventHandler(eventType: string) {
  return SetMetadata(INTERNAL_EVENT_HANDLER_METADATA, eventType);
}
