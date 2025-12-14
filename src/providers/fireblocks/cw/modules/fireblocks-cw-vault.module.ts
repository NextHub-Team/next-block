import { Module, forwardRef } from '@nestjs/common';
import { FireblocksCoreModule } from '../base/fireblocks-core.module';
import { FireblocksCwVaultService } from '../services/fireblocks-cw-vault.service';

@Module({
  imports: [forwardRef(() => FireblocksCoreModule)],
  providers: [FireblocksCwVaultService],
  exports: [FireblocksCwVaultService],
})
export class FireblocksCwVaultModule {}
