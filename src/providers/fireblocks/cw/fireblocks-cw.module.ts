import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { FireblocksCoreModule } from './base/fireblocks-core.module';
import { FireblocksCwRegistryModule } from './fireblocks-cw-registry.module';
import { FireblocksWebhookModule } from './webhook/fireblocks-webhook.module';
import { FireblocksCwAdminController } from './controllers/fireblocks-cw-admin.controller';
import { FireblocksCwBaseController } from './fireblocks-cw.controller';
import { FireblocksCwClientController } from './controllers/fireblocks-cw-client.controller';
import { FireblocksCwAdminService } from './services/fireblocks-cw-admin.service';
import { FireblocksCwClientService } from './services/fireblocks-cw-client.service';
import { FireblocksCwAdminVaultModule } from './modules/fireblocks-cw-admin-vault.module';
import { FireblocksCwVaultModule } from './modules/fireblocks-cw-vault.module';

@Module({
  imports: [
    FireblocksCoreModule,
    FireblocksWebhookModule,
    FireblocksCwRegistryModule,
    FireblocksCwAdminVaultModule,
    FireblocksCwVaultModule,
    RouterModule.register([
      {
        path: 'fireblocks/cw',
        module: FireblocksCwModule,
      },
    ]),
  ],
  providers: [FireblocksCwAdminService, FireblocksCwClientService],
  controllers: [
    FireblocksCwBaseController,
    FireblocksCwClientController,
    FireblocksCwAdminController,
  ],
  exports: [
    FireblocksCoreModule,
    FireblocksWebhookModule,
    FireblocksCwRegistryModule,
    FireblocksCwAdminService,
    FireblocksCwClientService,
  ],
})
export class FireblocksCwModule {}
