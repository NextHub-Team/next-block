import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { RewardMinterService } from './reward-minter.service';
import { RewardMintEventDto } from './dto/reward-mint-event.dto';
import { RewardMint } from './domain/reward-mint';
import { RegisterApiTag } from '../../common/api-docs/decorators/register-api-tag.decorator';

@RegisterApiTag(
  'Address Management – Reward Minter',
  'Handle reward mint events and apply them to RewardToken contract',
)
@Controller({
  path: 'address-management/reward-minter',
  version: '11',
})
export class RewardMinterController {
  constructor(private readonly rewardMinterService: RewardMinterService) {}

  // @Post('direct-test')
  // @HttpCode(HttpStatus.CREATED)
  // @ApiCreatedResponse({ type: RewardMint })
  // async directTest(): Promise<RewardMint> {
  //   return this.rewardMinterService.directTestMint();
  // }

  // @Post('apply')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: RewardMint })
  // async apply(@Body() dto: RewardMintEventDto): Promise<RewardMint> {
  //   return this.rewardMinterService.applyFromEvent(dto);
  // }
}
