import { Injectable } from '@nestjs/common';
import { AbstractAdminService } from '../base/abstract-admin.service';
import { FireblocksErrorMapper } from '../../../infrastructure/persistence/relational/mappers/fireblocks-error.mapper';

@Injectable()
export class AdminWithdrawalsService extends AbstractAdminService {
  constructor(private readonly errorMapper: FireblocksErrorMapper) {
    super(AdminWithdrawalsService.name);
  }

  async reviewWithdrawal(externalTxId: string): Promise<void> {
    this.logAction(`Review withdrawal ${externalTxId}`);
  }

  classifyError(error: unknown): void {
    const outcome = this.errorMapper.mapToDomainOutcome(error);
    this.debug(`Withdrawal outcome classified as ${outcome}`);
  }
}
