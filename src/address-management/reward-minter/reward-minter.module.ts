import { Module } from '@nestjs/common';
import { RewardMinterController } from './reward-minter.controller';
import { RewardMinterService } from './reward-minter.service';
import { RewardMinterConsumer } from './infrastructure/messaging/reward-minter.consumer';
import { AvaxSleeveTokenAdapter } from './infrastructure/blockchain/avax-sleeve-token.adapter';
import { FireblocksCwModule } from '../../providers/fireblocks/cw/fireblocks-cw.module';
import { UsersModule } from '../../users/users.module';
import { SleeveRegistryModule } from '../sleeve-registry/sleeve-registry.module';

@Module({
  imports: [UsersModule, FireblocksCwModule, SleeveRegistryModule],
  controllers: [RewardMinterController, RewardMinterConsumer],
  providers: [RewardMinterService, AvaxSleeveTokenAdapter],
})
export class RewardMinterModule {}
