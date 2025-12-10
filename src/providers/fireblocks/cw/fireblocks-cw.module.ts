import { Module } from '@nestjs/common';
import { FireblocksCwRegistryModule } from './core/fireblocks-cw-registry.module';
import { FireblocksWebhookModule } from './webhook/fireblocks-webhook.module';

@Module({
  imports: [
    FireblocksWebhookModule,
    FireblocksCwRegistryModule,
  ],
  exports: [
    FireblocksWebhookModule,
    FireblocksCwRegistryModule,
  ],
})
export class FireblocksCwModule {}
