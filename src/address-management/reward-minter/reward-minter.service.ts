import { Injectable, Logger } from '@nestjs/common';
import { RewardMintEventDto } from './dto/reward-mint-event.dto';
import { RewardMint } from './domain/reward-mint';
import { AvaxRewardTokenAdapter } from './infrastructure/blockchain/avax-reward-token.adapter';

@Injectable()
export class RewardMinterService {
  private readonly logger = new Logger(RewardMinterService.name);

  constructor(
    private readonly avaxAdapter: AvaxRewardTokenAdapter,
  ) {}

  private resolveWalletAddress(userId: string): string {
    const addr = process.env.DEFAULT_REWARD_WALLET_ADDRESS;
    if (!addr) {
      throw new Error('DEFAULT_REWARD_WALLET_ADDRESS must be set');
    }
    return addr.toLowerCase();
  }

  async applyFromEvent(dto: RewardMintEventDto): Promise<RewardMint> {
    const walletAddress = this.resolveWalletAddress(dto.userId);

    const domain = new RewardMint({
      userId: dto.userId,
      points: dto.points,
      functionType: dto.functionType,
      tokenType: dto.tokenType,
      walletAddress,
      reason: dto.reason ?? null,
      sleeveId: dto.sleeveId ?? null,
      timestamp: dto.timestamp,
    });

    this.logger.log(
      `Applying RewardToken for user=${domain.userId} wallet=${domain.walletAddress} points=${domain.points} functionType=${domain.functionType} tokenType=${domain.tokenType}`,
    );

    await this.avaxAdapter.applyFromEvent(walletAddress, dto);

    return domain;
  }

  async directTestMint(): Promise<RewardMint> {
    const dto: RewardMintEventDto = {
      event: 'points.mint',
      timestamp: new Date().toISOString(),
      userId: 'test-user-123',
      points: 100,
      functionType: 'Transfer-In',
      tokenType: 'reward',
      reason: 'direct-test',
      sleeveId: 'test-sleeve-1',
    };

    return this.applyFromEvent(dto);
  }
}
