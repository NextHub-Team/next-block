import { Global, Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../../../users/users.module';
import { FireblocksWebhookModule } from './webhook/fireblocks-webhook.module';
import { FireblocksCwAdminController } from './controllers/fireblocks-cw-admin.controller';
import { FireblocksCwBaseController } from './fireblocks-cw.controller';
import { FireblocksCwClientController } from './controllers/fireblocks-cw-client.controller';
import { FireblocksCwAdminService } from './services/fireblocks-cw-admin.service';
import { FireblocksCwClientService } from './services/fireblocks-cw-client.service';
import { FireblocksCwService } from './fireblocks-cw.service';
import { FireblocksErrorMapper } from './infrastructure/persistence/relational/mappers/fireblocks-error.mapper';
import { EnableGuard } from '../../../common/guards/service-enabled.guard';

@Global()
@Module({
  imports: [
    ConfigModule,
    UsersModule,
    FireblocksWebhookModule,
    RouterModule.register([
      {
        path: 'fireblocks/cw',
        module: FireblocksCwModule,
      },
    ]),
  ],
  providers: [
    FireblocksCwService,
    FireblocksErrorMapper,
    FireblocksCwAdminService,
    FireblocksCwClientService,
    EnableGuard,
  ],
  controllers: [
    FireblocksCwBaseController,
    FireblocksCwClientController,
    FireblocksCwAdminController,
  ],
  exports: [
    ConfigModule,
    FireblocksWebhookModule,
    FireblocksCwService,
    FireblocksErrorMapper,
    FireblocksCwAdminService,
    FireblocksCwClientService,
  ],
})
export class FireblocksCwModule {}
