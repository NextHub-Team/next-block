# Internal Events

This module wraps the outbox + Redis Streams workflow for cross-module events inside the monolith.

- Toggle with `INTERNAL_EVENTS_ENABLE` (default: `true`).
- Defaults are pulled from `INTERNAL_EVENTS_*` env vars with safe fallbacks (`SERVICE_NAME`, `REDIS_URL`, etc.).
- Configure via `InternalEventsModule.forRootAsync()` to consume typed settings from `ConfigModule`.



## Emitting an event

```ts
// apps/wallets/wallets.service.ts (example)
@Injectable()
export class WalletsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly internalEvents: InternalEventsService,
  ) {}

  async createWallet(): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      // ... persist wallet first
      await this.internalEvents.emit(manager, {
        eventType: 'wallet.created',
        payload: { walletId: 'b67b7c40-6cf5-4b1b-bad2-f117722a905f' },
      });
    });
  }
}
```

## Consuming an event

```ts
@Injectable()
@InternalEventHandler('wallet.created')
export class WalletCreatedHandler {
  async handle(event: InternalEvent) {
    // event.payload contains the object passed to emit()
    // add your side-effects or projections here
  }
}
```

The consumer runs automatically when the module is enabled. Handlers receive a domain `InternalEvent` with `eventId`, `eventType`, `payload`, and `occurredAt` (as `Date`).

## Horizontal scaling

- Multiple instances can share one DB + Redis. Use the same `serviceName` so they join the same consumer group; each instance creates a unique consumer id.
- Dispatcher concurrency: selects unpublished rows with `pessimistic_write` + `skip_locked`, so rows are dispatched once across instances.
- Consumer concurrency: Redis consumer groups distribute messages; `xautoclaim` reclaims pending messages if an instance dies.
- Idempotency: `SET ... NX EX` guards handler execution against duplicate deliveries.
- DLQ/retries: counters live in Redis, so the retry budget and DLQ routing are consistent across instances.
