import { Module } from '@nestjs/common';
import { RewardMinterController } from './reward-minter.controller';
import { RewardMinterService } from './reward-minter.service';
import { RewardMinterConsumer } from './infrastructure/messaging/reward-minter.consumer';
import { AvaxSleeveTokenAdapter } from './infrastructure/blockchain/avax-sleeve-token.adapter';
import { FireblocksCwModule } from '../../providers/fireblocks/cw/fireblocks-cw.module';
import { UsersModule } from '../../users/users.module';

@Module({
  imports: [UsersModule, FireblocksCwModule],
  controllers: [RewardMinterController, RewardMinterConsumer],
  providers: [RewardMinterService, AvaxSleeveTokenAdapter],
  exports: [RewardMinterService],
})
export class RewardMinterModule {}
