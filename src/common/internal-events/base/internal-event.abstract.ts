export abstract class InternalEventBase<TPayload> {
  protected constructor(
    public readonly eventType: string,
    public readonly payload: TPayload,
  ) {}

  getEvent(): { eventType: string; payload: TPayload } {
    return {
      eventType: this.eventType,
      payload: this.payload,
    };
  }
}
