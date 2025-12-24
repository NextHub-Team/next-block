import { Injectable } from '@nestjs/common';
import { InternalEventHandler } from '../../../../common/internal-events/helper/internal-event-handler.decorator';
import { InternalEvent } from '../../../../internal-events/domain/internal-event';
import {
  VERO_LOGIN_USER_ADDED_EVENT,
  VERO_LOGIN_USER_DELETED_EVENT,
} from '../../../../users/types/user-event.type';
import { UserEventDto } from '../../../../users/dto/user.dto';
import { FireblocksCwService } from '../fireblocks-cw.service';
import { InternalEventHandlerBase } from '../../../../common/internal-events/base/internal-event-handler.base';

@Injectable()
@InternalEventHandler(VERO_LOGIN_USER_ADDED_EVENT)
export class FireblocksCwUserAddedEventHandler extends InternalEventHandlerBase {
  constructor(private readonly fireblocksCwService: FireblocksCwService) {
    super(FireblocksCwUserAddedEventHandler.name);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async handle(event: InternalEvent): Promise<void> {
    const payload = new UserEventDto(event.payload as Partial<UserEventDto>);
    const eventId = this.id(event);

    this.received(
      event,
      eventId,
      payload,
      this.fireblocksCwService.getOptions().debugLogging,
    );

    try {
      // TODO: Add Fireblocks-specific side-effects (e.g., provision vault, sync state).
      this.processed(event, eventId);
    } catch (error) {
      this.failed(event, eventId, error);
    }
  }
}

@Injectable()
@InternalEventHandler(VERO_LOGIN_USER_DELETED_EVENT)
export class FireblocksCwUserDeletedEventHandler extends InternalEventHandlerBase {
  constructor(private readonly fireblocksCwService: FireblocksCwService) {
    super(FireblocksCwUserDeletedEventHandler.name);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async handle(event: InternalEvent): Promise<void> {
    const payload = new UserEventDto(event.payload as Partial<UserEventDto>);
    const eventId = this.id(event);

    this.received(
      event,
      eventId,
      payload,
      this.fireblocksCwService.getOptions().debugLogging,
    );

    try {
      // TODO: Add Fireblocks-specific side-effects (e.g., cleanup user resources).
      this.processed(event, eventId);
    } catch (error) {
      this.failed(event, eventId, error);
    }
  }
}
