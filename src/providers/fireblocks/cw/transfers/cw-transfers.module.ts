import { Module } from '@nestjs/common';
import { FireblocksCoreModule } from '../../core/fireblocks-core.module';
import { CwTransfersService } from './cw-transfers.service';

@Module({
  imports: [FireblocksCoreModule],
  providers: [CwTransfersService],
  exports: [CwTransfersService],
})
export class CwTransfersModule {}
