import { Injectable, Logger } from '@nestjs/common';
import { FireblocksErrorMapper } from '../../infrastructure/persistence/relational/mappers/fireblocks-error.mapper';

@Injectable()
export class AdminWithdrawalsService {
  private readonly logger = new Logger(AdminWithdrawalsService.name);

  constructor(private readonly errorMapper: FireblocksErrorMapper) {}

  async reviewWithdrawal(externalTxId: string): Promise<void> {
    this.logger.log(`Review withdrawal ${externalTxId}`);
  }

  classifyError(error: unknown): void {
    const outcome = this.errorMapper.mapToDomainOutcome(error);
    this.logger.debug(`Withdrawal outcome classified as ${outcome}`);
  }
}
