import { Injectable } from '@nestjs/common';
import { FireblocksClientService } from '../shared/fireblocks-client.service';
import { CwDepositService } from './cw-deposit.service';
import { CwPortfolioService } from './cw-portfolio.service';
import { CwTransactionsService } from './cw-transactions.service';
import { CwTransfersService } from './cw-transfers.service';

@Injectable()
export class CwClientService {
  constructor(
    public readonly portfolio: CwPortfolioService,
    public readonly deposits: CwDepositService,
    public readonly transfers: CwTransfersService,
    public readonly transactions: CwTransactionsService,
    public readonly clientConfig: FireblocksClientService,
  ) {}
}
