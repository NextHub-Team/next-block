import { Injectable } from '@nestjs/common';
import { FireblocksCwService } from '../../fireblocks-cw.service';
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
    public readonly clientConfig: FireblocksCwService,
  ) {}
}
