import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RewardMintEventDto } from './dto/reward-mint-event.dto';
import {
  AvaxSleeveTokenAdapter,
  SleeveTokenType,
} from './infrastructure/blockchain/avax-sleeve-token.adapter';
import { FireblocksCwClientService } from '../../providers/fireblocks/cw/services/fireblocks-cw-client.service';
import { UsersService } from '../../users/users.service';
import { readSleeves } from '../contract-deployer/sleeve-store';

@Injectable()
export class RewardMinterService {
  private readonly logger = new Logger(RewardMinterService.name);

  constructor(
    private readonly tokenAdapter: AvaxSleeveTokenAdapter,
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

  private parseTokenType(input?: string): SleeveTokenType | undefined {
    if (!input) return undefined;

    const t = input.toLowerCase().trim();
    if (t === SleeveTokenType.Reward) return SleeveTokenType.Reward;
    if (t === SleeveTokenType.Status) return SleeveTokenType.Status;
    if (t === SleeveTokenType.Subscription) return SleeveTokenType.Subscription;

    throw new Error(`Invalid tokenType=${input}`);
  }

  private resolveSleeveContractOrThrow(sleeveId: string): string {
    const key = String(sleeveId ?? '').trim();
    if (!key) throw new Error('sleeveId is required');

    const sleeves = readSleeves();
    const addr = sleeves[key];

    if (!addr) {
      this.logger.error(
        `Sleeve not registered. key="${key}" keysInStore=${JSON.stringify(Object.keys(sleeves))}`,
      );
      throw new Error(`No contract address registered for sleeveId=${key}`);
    }

    return addr;
    // TODO: replace JSON store with DB-backed repository
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

    return depositAddress;
  }

  async handleEvent(dto: RewardMintEventDto): Promise<void> {
    this.logger.log(
      `handleEvent start userId=${dto.userId} sleeveId=${JSON.stringify(dto.sleeveId)} fn=${String(
        (dto as any).functionType,
      )} tokenType=${String((dto as any).tokenType)} points=${dto.points}`,
    );

    const walletAddress = await this.resolveOrCreateWalletAddress(dto);
    this.logger.log(`wallet resolved=${walletAddress}`);

    const sleeveContractAddress = this.resolveSleeveContractOrThrow(dto.sleeveId);
    this.logger.log(`sleeve contract resolved=${sleeveContractAddress}`);

    await this.tokenAdapter.applyEvent(sleeveContractAddress, walletAddress, dto);

    this.logger.log(`handleEvent done userId=${dto.userId} sleeveId=${dto.sleeveId}`);
  }

  async getBalance(params: {
    sleeveId: string;
    walletAddress: string;
    tokenType?: string;
  }): Promise<
    | { tokenType: SleeveTokenType; balance: string; contractAddress: string }
    | {
        balances: { reward: string; status: string; subscription: string };
        contractAddress: string;
      }
  > {
    const contractAddress = this.resolveSleeveContractOrThrow(params.sleeveId);
    const tokenType = this.parseTokenType(params.tokenType);

    if (tokenType) {
      const bal = await this.tokenAdapter.getBalance(
        contractAddress,
        params.walletAddress,
        tokenType,
      );
      return { tokenType, balance: bal.toString(), contractAddress };
    }

    const all = await this.tokenAdapter.getAllBalances(
      contractAddress,
      params.walletAddress,
    );

    return {
      contractAddress,
      balances: {
        reward: all.reward.toString(),
        status: all.status.toString(),
        subscription: all.subscription.toString(),
      },
    };
  }
}
