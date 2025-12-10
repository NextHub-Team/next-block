import { Injectable, Logger } from '@nestjs/common';
import { FireblocksClientService } from '../shared/fireblocks-client.service';
import { FireblocksErrorMapper } from '../../infrastructure/persistence/relational/mappers/fireblocks-error.mapper';
import { FireblocksResilienceService } from '../shared/fireblocks-resilience.service';

export interface TransferCommand {
  source: string;
  destination: string;
  assetId: string;
  amount: string;
  externalTxId: string;
  note?: string;
}

@Injectable()
export class CwTransfersService {
  private readonly logger = new Logger(CwTransfersService.name);

  constructor(
    private readonly client: FireblocksClientService,
    private readonly errorMapper: FireblocksErrorMapper,
    private readonly resilience: FireblocksResilienceService,
  ) {}

  async preflightValidate(command: TransferCommand): Promise<void> {
    this.logger.log(`Pre-flight validation for ${command.externalTxId}`);
    this.logger.debug(`Validating asset ${command.assetId} from ${command.source}`);
  }

  async submit(command: TransferCommand): Promise<void> {
    try {
      this.logger.log(`Submitting transfer ${command.externalTxId}`);
      this.logger.debug(`Using basePath ${this.client.getOptions().basePath}`);
    } catch (error) {
      const outcome = this.errorMapper.mapToDomainOutcome(error);
      if (this.resilience.shouldOpenCircuit(outcome)) {
        this.logger.warn(`Circuit breaker should open for outcome ${outcome}`);
      }
      throw error;
    }
  }
}
