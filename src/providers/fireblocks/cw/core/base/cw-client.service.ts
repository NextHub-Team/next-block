import { Injectable } from '@nestjs/common';
import { CwDepositService } from '../services/cw-deposit.service';
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
}
