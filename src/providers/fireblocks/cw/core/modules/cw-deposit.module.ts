import { Module, forwardRef } from '@nestjs/common';
import { FireblocksCoreModule } from '../fireblocks-core.module';
import { CwDepositService } from '../services/cw-deposit.service';

@Module({
  imports: [forwardRef(() => FireblocksCoreModule)],
  providers: [CwDepositService],
  exports: [CwDepositService],
})
export class CwDepositModule {}
