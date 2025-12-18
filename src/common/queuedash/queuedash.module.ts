import { Global, Module } from '@nestjs/common';
import { QueueDashRegistry } from './queuedash.registry';

@Global()
@Module({
  providers: [QueueDashRegistry],
  exports: [QueueDashRegistry],
})
export class QueueDashModule {}
