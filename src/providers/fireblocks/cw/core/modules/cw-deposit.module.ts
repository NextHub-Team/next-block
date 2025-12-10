import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FireblocksCoreModule } from '../fireblocks-core.module';
import { FireblocksCwService } from '../../fireblocks-cw.service';
import { CwDepositService } from '../services/cw-deposit.service';

@Module({
  imports: [ConfigModule, FireblocksCoreModule],
  providers: [CwDepositService, FireblocksCwService],
  exports: [CwDepositService],
})
export class CwDepositModule {}
