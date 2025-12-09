import { Module } from '@nestjs/common';
import { FireblocksCoreModule } from '../../core/fireblocks-core.module';
import { AdminGasOperationsService } from './admin-gas-operations.service';

@Module({
  imports: [FireblocksCoreModule],
  providers: [AdminGasOperationsService],
  exports: [AdminGasOperationsService],
})
export class AdminGasOperationsModule {}
