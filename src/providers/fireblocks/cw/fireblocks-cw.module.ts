import { Module } from '@nestjs/common';
import { FireblocksCwUnifiedModule } from './core/fireblocks-cw-unified.module';
import { FireblocksWebhookModule } from './webhook/fireblocks-webhook.module';

@Module({
  imports: [
    FireblocksWebhookModule,
    FireblocksCwUnifiedModule,
  ],
  exports: [
    FireblocksWebhookModule,
    FireblocksCwUnifiedModule,
  ],
})
export class FireblocksCwModule {}
