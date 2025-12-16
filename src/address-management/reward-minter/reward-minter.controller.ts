import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { RewardMinterService } from './reward-minter.service';
import { RegisterApiTag } from '../../common/api-docs/decorators/register-api-tag.decorator';

type TokenType = 'reward' | 'status' | 'subscription';

@RegisterApiTag(
  'Address Management',
  'Handle reward mint events and apply them to SleeveToken contracts',
)
@Controller({
  path: 'address-management/reward-minter',
})
export class RewardMinterController {
  constructor(private readonly rewardMinterService: RewardMinterService) {}

  @Get('balance')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    schema: {
      example: {
        contractAddress: '0x...',
        walletAddress: '0x...',
        sleeveId: 'test-sleeve-1',
        tokenType: 'reward',
        balance: '40',
        balances: { reward: '40', status: '0', subscription: '0' },
      },
    },
  })
  async getBalance(
    @Query('sleeveId') sleeveId: string,
    @Query('walletAddress') walletAddress: string,
    @Query('tokenType') tokenType?: TokenType,
  ) {
    const result = await this.rewardMinterService.getBalance({
      sleeveId,
      walletAddress,
      tokenType,
    });

    if ('tokenType' in result) {
      return {
        sleeveId,
        walletAddress,
        contractAddress: result.contractAddress,
        tokenType: result.tokenType,
        balance: result.balance,
      };
    }

    return {
      sleeveId,
      walletAddress,
      contractAddress: result.contractAddress,
      balances: result.balances,
    };
  }
}
