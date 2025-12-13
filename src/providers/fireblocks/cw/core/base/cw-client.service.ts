import { Injectable } from '@nestjs/common';
import { FireblocksCustodialWalletDto } from '../../dto/fireblocks-wallet.dto';
import {
  CreateVaultWalletRequestDto,
  EnsureVaultWalletOptionsDto,
  FireblocksUserIdentityDto,
} from '../../dto/fireblocks-vault-requests.dto';
import { CwVaultService } from '../services/cw-vault.service';
import { CwTransactionsService } from '../services/cw-transactions.service';

@Injectable()
export class CwClientService {
  constructor(
    public readonly vaults: CwVaultService,
    public readonly transactions: CwTransactionsService,
  ) {}

  // Backward compatibility aliases for merged vault service
  get deposits(): CwVaultService {
    return this.vaults;
  }

  get portfolio(): CwVaultService {
    return this.vaults;
  }

  async createWallet(
    command: CreateVaultWalletRequestDto,
  ): Promise<FireblocksCustodialWalletDto> {
    return this.vaults.createVaultWalletForAsset(command);
  }

  async ensureUserWallet(
    user: FireblocksUserIdentityDto,
    assetId: string,
    options?: EnsureVaultWalletOptionsDto,
  ): Promise<FireblocksCustodialWalletDto> {
    return this.vaults.ensureUserVaultWalletForAsset(user, assetId, options);
  }
}
