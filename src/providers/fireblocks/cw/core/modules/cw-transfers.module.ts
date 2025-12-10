import { Module } from '@nestjs/common';
import { FireblocksCoreModule } from '../fireblocks-core.module';
import { CwTransfersService } from '../services/cw-transfers.service';

@Module({
  imports: [FireblocksCoreModule],
  providers: [CwTransfersService],
  exports: [CwTransfersService],
})
export class CwTransfersModule {}
