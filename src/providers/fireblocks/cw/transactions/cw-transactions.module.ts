import { Module } from '@nestjs/common';
import { FireblocksCoreModule } from '../core/fireblocks-core.module';
import { CwTransactionsService } from './cw-transactions.service';

@Module({
  imports: [FireblocksCoreModule],
  providers: [CwTransactionsService],
  exports: [CwTransactionsService],
})
export class CwTransactionsModule {}
