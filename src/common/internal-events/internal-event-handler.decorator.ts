import { SetMetadata } from '@nestjs/common';
import { INTERNAL_EVENT_HANDLER_METADATA } from './internal-events.constants';

export const InternalEventHandler = (eventType: string) =>
  SetMetadata(INTERNAL_EVENT_HANDLER_METADATA, eventType);
