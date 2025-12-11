import { Module } from '@nestjs/common';
import { FireblocksCoreModule } from '../../fireblocks-core.module';
import { AdminWithdrawalsService } from '../services/admin-withdrawals.service';

@Module({
  imports: [FireblocksCoreModule],
  providers: [AdminWithdrawalsService],
  exports: [AdminWithdrawalsService],
})
export class AdminWithdrawalsModule {}
