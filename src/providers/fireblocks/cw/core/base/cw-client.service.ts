import { Injectable } from '@nestjs/common';
import { FireblocksCustodialWalletDto } from '../../dto/fireblocks-wallet.dto';
import {
  CreateVaultWalletRequest,
  CwVaultService,
  FireblocksUserIdentity,
} from '../services/cw-vault.service';
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
    command: CreateVaultWalletRequest,
  ): Promise<FireblocksCustodialWalletDto> {
    return this.vaults.createCustodialWallet(command);
  }

  async ensureUserWallet(
    user: FireblocksUserIdentity,
    assetId: string,
    options?: {
      hiddenOnUI?: boolean;
      autoFuel?: boolean;
      addressDescription?: string;
      idempotencyKey?: string;
    },
  ): Promise<FireblocksCustodialWalletDto> {
    return this.vaults.ensureUserCustodialWallet(user, assetId, options);
  }
}
