import { Module } from '@nestjs/common';
import { FireblocksCoreModule } from './base/fireblocks-core.module';
import { FireblocksCwRegistryService } from './fireblocks-cw-registry.service';
import { FireblocksCwAdminVaultModule } from './modules/fireblocks-cw-admin-vault.module';
import { FireblocksCwVaultModule } from './modules/fireblocks-cw-vault.module';

const ADMIN_MODULES = [FireblocksCwAdminVaultModule];

const NON_ADMIN_MODULES = [FireblocksCwVaultModule];

@Module({
  imports: [FireblocksCoreModule, ...ADMIN_MODULES, ...NON_ADMIN_MODULES],
  providers: [FireblocksCwRegistryService],
  exports: [
    FireblocksCoreModule,
    FireblocksCwRegistryService,
    ...ADMIN_MODULES,
    ...NON_ADMIN_MODULES,
  ],
})
export class FireblocksCwRegistryModule {}
