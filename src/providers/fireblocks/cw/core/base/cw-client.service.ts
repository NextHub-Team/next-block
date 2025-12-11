import { Injectable } from '@nestjs/common';
import { FireblocksCustodialWalletDto } from '../../dto/fireblocks-wallet.dto';
import {
  CwDepositService,
  CreateVaultWalletRequest,
  FireblocksUserIdentity,
} from '../services/cw-deposit.service';
import { CwPortfolioService } from '../services/cw-portfolio.service';
import { CwTransactionsService } from '../services/cw-transactions.service';
import { CwTransfersService } from '../services/cw-transfers.service';

@Injectable()
export class CwClientService {
  constructor(
    public readonly portfolio: CwPortfolioService,
    public readonly deposits: CwDepositService,
    public readonly transfers: CwTransfersService,
    public readonly transactions: CwTransactionsService,
  ) {}

  async createWallet(
    command: CreateVaultWalletRequest,
  ): Promise<FireblocksCustodialWalletDto> {
    return this.deposits.createCustodialWallet(command);
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
    return this.deposits.ensureUserCustodialWallet(user, assetId, options);
  }
}
