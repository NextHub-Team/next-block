export type InternalEventPayload = Record<string, unknown>;

export type InternalEventToEmit<TPayload = InternalEventPayload> = {
  eventType: string;
  payload: TPayload;
};

export type InternalEventMessage<TPayload = InternalEventPayload> = {
  eventId: string;
  eventType: string;
  payload: TPayload;
  occurredAt: string;
};
