import { Module } from '@nestjs/common';
import { AddressManagementController } from './address-management.controller';
import { AddressManagementService } from './address-management.service';
import { RewardMinterModule } from './reward-minter/reward-minter.module';

@Module({
  imports: [RewardMinterModule],
  controllers: [AddressManagementController],
  providers: [AddressManagementService],
})
export class AddressManagementModule {}
