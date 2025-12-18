import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddressManagementService } from './address-management.service';
import { RewardMintEventDto } from './reward-minter/dto/reward-mint-event.dto';

@ApiTags('Address Management')
@Controller('address-management')
export class AddressManagementController {
  constructor(private readonly addressManagementService: AddressManagementService) {}

  @Post('rewards/mint')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Mint/Burn sleeve tokens via HTTP',
    description:
      'This resolves/creates Fireblocks wallet for the user, resolves sleeve contract address, then mints/burns based on functionType.',
  })
  @ApiBody({
    type: RewardMintEventDto,
    examples: {
      transferIn: {
        summary: 'Transfer-In (mint)',
        value: {
          userId: 'VeroId',
          points: 0,
          functionType: 'Transfer-In',
          tokenType: 'subscription',
          sleeveId: 'sleeveId',
        },
      },
      transferOut: {
        summary: 'Transfer-Out (burn)',
        value: {
          userId: 'VeroId',
          points: 5,
          functionType: 'Transfer-Out',
          tokenType: 'reward',
          sleeveId: 'sleeveId',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Operation accepted and executed',
    schema: {
      example: {
        ok: true,
        message: 'Reward event applied',
        payload: {
          userId: 'VeroId',
          points: 0,
          functionType: 'Transfer-In',
          tokenType: 'subscription',
          sleeveId: 'sleeveId',
        },
      },
    },
  })
  async mintViaHttp(@Body() dto: RewardMintEventDto) {
    await this.addressManagementService.applyRewardEvent(dto);

    return {
      ok: true,
      message: 'Reward event applied',
      payload: dto,
    };
  }
}
