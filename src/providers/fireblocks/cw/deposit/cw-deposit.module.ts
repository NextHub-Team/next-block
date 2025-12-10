import { Module } from '@nestjs/common';
import { FireblocksCoreModule } from '../core/fireblocks-core.module';
import { CwDepositService } from './cw-deposit.service';

@Module({
  imports: [FireblocksCoreModule],
  providers: [CwDepositService],
  exports: [CwDepositService],
})
export class CwDepositModule {}
