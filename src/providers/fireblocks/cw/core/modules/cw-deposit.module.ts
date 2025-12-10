import { Module } from '@nestjs/common';
import { FireblocksCoreModule } from '../fireblocks-core.module';
import { CwDepositService } from '../services/cw-deposit.service';

@Module({
  imports: [FireblocksCoreModule],
  providers: [CwDepositService],
  exports: [CwDepositService],
})
export class CwDepositModule {}
