import { Module } from '@nestjs/common';
import { FireblocksCoreModule } from '../fireblocks-core.module';
import { CwTransactionsService } from '../services/cw-transactions.service';

@Module({
  imports: [FireblocksCoreModule],
  providers: [CwTransactionsService],
  exports: [CwTransactionsService],
})
export class CwTransactionsModule {}
