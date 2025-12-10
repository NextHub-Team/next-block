import { Module } from '@nestjs/common';
import { CwBaseModule } from './core/modules/cw-base.module';
import { FireblocksCwRegistryModule } from './core/fireblocks-cw-registry.module';
import { FireblocksWebhookModule } from './webhook/fireblocks-webhook.module';

@Module({
  imports: [
    FireblocksWebhookModule,
    FireblocksCwRegistryModule,
    CwBaseModule,
  ],
  exports: [
    FireblocksWebhookModule,
    FireblocksCwRegistryModule,
    CwBaseModule,
  ],
})
export class FireblocksCwModule {}
