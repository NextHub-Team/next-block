import { Module, forwardRef } from '@nestjs/common';
import { FireblocksCoreModule } from '../fireblocks-core.module';
import { CwVaultService } from '../services/cw-vault.service';

@Module({
  imports: [forwardRef(() => FireblocksCoreModule)],
  providers: [CwVaultService],
  exports: [CwVaultService],
})
export class CwVaultModule {}
