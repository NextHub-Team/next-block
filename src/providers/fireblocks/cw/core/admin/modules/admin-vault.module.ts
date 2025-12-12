import { Module } from '@nestjs/common';
import { FireblocksCoreModule } from '../../fireblocks-core.module';
import { AdminVaultService } from '../services/admin-vault.service';

@Module({
  imports: [FireblocksCoreModule],
  providers: [AdminVaultService],
  exports: [AdminVaultService],
})
export class AdminVaultModule {}
