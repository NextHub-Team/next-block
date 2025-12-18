import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RewardMinterService } from './reward-minter.service';

type TokenType = 'reward' | 'status' | 'subscription';

@ApiTags('Address Management')
@Controller({
  path: 'address-management/reward-minter',
})
export class RewardMinterController {
  constructor(private readonly rewardMinterService: RewardMinterService) {}

  @Get('balance')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get wallet balance for a sleeve contract',
    description:
      'If tokenType is provided, returns balance for that token type. Otherwise returns balances for all token types.',
  })
  @ApiQuery({
    name: 'sleeveId',
    required: true,
    type: String,
    example: 'test-sleeve-5',
  })
  @ApiQuery({
    name: 'walletAddress',
    required: true,
    type: String,
    example: '0x1457d39F5e2d4513E622A7d3716cF1E7CcB14cea',
  })
  @ApiQuery({
    name: 'tokenType',
    required: false,
    enum: ['reward', 'status', 'subscription'],
    example: 'reward',
  })
  @ApiOkResponse({
    schema: {
      oneOf: [
        {
          example: {
            sleeveId: 'test-sleeve-5',
            walletAddress: '0x1457d39F5e2d4513E622A7d3716cF1E7CcB14cea',
            contractAddress: '0x...',
            tokenType: 'reward',
            balance: '40',
          },
        },
        {
          example: {
            sleeveId: 'test-sleeve-5',
            walletAddress: '0x1457d39F5e2d4513E622A7d3716cF1E7CcB14cea',
            contractAddress: '0x...',
            balances: { reward: '40', status: '0', subscription: '0' },
          },
        },
      ],
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
