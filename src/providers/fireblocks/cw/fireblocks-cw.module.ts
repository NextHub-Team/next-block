import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../../../users/users.module';
import { AccountsModule } from '../../../accounts/accounts.module';
import { FireblocksCwAdminController } from './controllers/fireblocks-cw-admin.controller';
import { FireblocksCwBaseController } from './fireblocks-cw.controller';
import { FireblocksCwClientController } from './controllers/fireblocks-cw-client.controller';
import { FireblocksCwAdminService } from './services/fireblocks-cw-admin.service';
import { FireblocksCwClientService } from './services/fireblocks-cw-client.service';
import { FireblocksCwService } from './fireblocks-cw.service';
import { FireblocksErrorMapper } from './infrastructure/persistence/relational/mappers/fireblocks-error.mapper';
import { EnableGuard } from '../../../common/guards/service-enabled.guard';

// TODO: 1) Verify Fireblocks error messages are surfaced in responses
// TODO: 2) Check and test bulk permissions in the Fireblocks console
// TODO: 3) Remove unused Fireblocks service functions
// TODO: 4) Verify wallet/account data persistence to the DB
// TODO: 5) Ensure no duplicate wallet/account creation
// TODO: 6) Confirm wallet/account recovery from Fireblocks cloud
// TODO: 7) Add admin bulk wallet creation
// TODO: 8) Persist wallet data from Fireblocks to DB during asset creation
// TODO: 9) Detect recovered wallets and skip duplicate creation by asset id

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    AccountsModule,
    RouterModule.register([
      {
        path: 'fireblocks/cw/service',
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
    FireblocksCwService,
    FireblocksErrorMapper,
    FireblocksCwAdminService,
    FireblocksCwClientService,
  ],
})
export class FireblocksCwModule {}
