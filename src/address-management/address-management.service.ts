import { Injectable } from '@nestjs/common';
import { RewardMinterService } from './reward-minter/reward-minter.service';
import { RewardMintEventDto } from './reward-minter/dto/reward-mint-event.dto';

@Injectable()
export class AddressManagementService {
  constructor(private readonly rewardMinterService: RewardMinterService) {}

  async applyRewardEvent(dto: RewardMintEventDto): Promise<void> {
    await this.rewardMinterService.handleEvent(dto);
  }
}
