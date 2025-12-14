import { Module } from '@nestjs/common';
import { FireblocksCoreModule } from '../base/fireblocks-core.module';
import { FireblocksCwAdminVaultService } from '../services/fireblocks-cw-admin-vault.service';

@Module({
  imports: [FireblocksCoreModule],
  providers: [FireblocksCwAdminVaultService],
  exports: [FireblocksCwAdminVaultService],
})
export class FireblocksCwAdminVaultModule {}
