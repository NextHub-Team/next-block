import { Module } from '@nestjs/common';
import { CwBaseModule } from './core/modules/cw-base.module';
import { FireblocksCoreModule } from './core/fireblocks-core.module';
import { FireblocksCwRegistryModule } from './core/fireblocks-cw-registry.module';
import { FireblocksWebhookModule } from './webhook/fireblocks-webhook.module';

@Module({
  imports: [
    FireblocksCoreModule,
    FireblocksWebhookModule,
    FireblocksCwRegistryModule,
    CwBaseModule,
  ],
  exports: [
    FireblocksCoreModule,
    FireblocksWebhookModule,
    FireblocksCwRegistryModule,
    CwBaseModule,
  ],
})
export class FireblocksCwModule {}
