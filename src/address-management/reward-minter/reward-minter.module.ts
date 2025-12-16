import { Module } from '@nestjs/common';
import { RewardMinterController } from './reward-minter.controller';
import { RewardMinterService } from './reward-minter.service';
import { RewardMinterConsumer } from './infrastructure/messaging/reward-minter.consumer';
import { AvaxRewardTokenAdapter } from './infrastructure/blockchain/avax-reward-token.adapter';
import { FireblocksCwModule } from '../../providers/fireblocks/cw/fireblocks-cw.module';
import { UsersModule } from '../../users/users.module';

@Module({
  imports: [UsersModule,FireblocksCwModule],
  controllers: [RewardMinterController, RewardMinterConsumer],
  providers: [RewardMinterService, AvaxRewardTokenAdapter],
  exports: [RewardMinterService, AvaxRewardTokenAdapter],
})
export class RewardMinterModule {}
