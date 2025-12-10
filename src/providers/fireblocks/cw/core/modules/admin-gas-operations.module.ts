import { Module } from '@nestjs/common';
import { FireblocksCoreModule } from '../fireblocks-core.module';
import { AdminGasOperationsService } from '../services/admin-gas-operations.service';

@Module({
  imports: [FireblocksCoreModule],
  providers: [AdminGasOperationsService],
  exports: [AdminGasOperationsService],
})
export class AdminGasOperationsModule {}
