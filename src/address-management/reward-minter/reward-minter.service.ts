import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ethers } from 'ethers';
import { RewardMintEventDto } from './dto/reward-mint-event.dto';
import { RewardMint } from './domain/reward-mint';
import { AvaxRewardTokenAdapter } from './infrastructure/blockchain/avax-reward-token.adapter';
import { FireblocksCwClientService } from '../../providers/fireblocks/cw/services/fireblocks-cw-client.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class RewardMinterService {
  private readonly logger = new Logger(RewardMinterService.name);

  constructor(
    private readonly fireblocksClient: FireblocksCwClientService,
    private readonly usersService: UsersService,
  ) {}

  private parseNumericId(value: string | number): number | null {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value !== 'string') return null;
    if (!/^\d+$/.test(value)) return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }

  async resolveOrCreateWalletAddress(dto: RewardMintEventDto): Promise<string> {
    const incomingUserId = dto.userId;

    const numericId = this.parseNumericId(incomingUserId);

    const user =
      numericId !== null
        ? await this.usersService.findById(numericId)
        : await this.usersService.findBySocialId(String(incomingUserId));

    if (!user) {
      throw new NotFoundException(
        `User not found (id/socialId): ${incomingUserId}`,
      );
    }

    const assetId = process.env.FIREBLOCKS_ASSET_ID ?? 'AVAXTEST';

    const fb = await this.fireblocksClient.ensureUserVaultWalletForAsset(
      { id: user.id, socialId: user.socialId ?? undefined },
      assetId,
      { addressDescription: 'User AVAX deposit' },
    );


    const anyFb = fb as any;

    const depositAddress =
      anyFb?.depositAddress?.address ??
      anyFb?.depositAddress ??
      anyFb?.address ??
      null;

    if (!depositAddress || typeof depositAddress !== 'string') {
  
      this.logger.error(
        `Fireblocks wallet response does not include an address. Keys=${Object.keys(anyFb || {}).join(',')}`,
      );
      throw new Error('Fireblocks wallet response missing deposit address');
    }

    const vaultAccountId =
      anyFb?.vaultAccountId ?? anyFb?.vaultAccount?.id ?? 'unknown';

    const resolvedAssetId =
      anyFb?.assetId ?? anyFb?.walletId ?? anyFb?.wallet?.id ?? assetId;

    this.logger.log(
      `Resolved wallet for userId=${incomingUserId} -> ${depositAddress} (vault=${vaultAccountId}, asset=${resolvedAssetId})`,
    );

    return depositAddress;
  }
}