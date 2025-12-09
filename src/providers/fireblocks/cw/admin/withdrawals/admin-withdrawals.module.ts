import { Module } from '@nestjs/common';
import { FireblocksCoreModule } from '../../core/fireblocks-core.module';
import { AdminWithdrawalsService } from './admin-withdrawals.service';

@Module({
  imports: [FireblocksCoreModule],
  providers: [AdminWithdrawalsService],
  exports: [AdminWithdrawalsService],
})
export class AdminWithdrawalsModule {}
