import { Injectable, Logger } from '@nestjs/common';
import { FireblocksClientProvider } from '../core/providers/fireblocks-client.provider';
import { FireblocksErrorMapper } from '../core/providers/fireblocks-error-mapper';
import { FireblocksResilience } from '../core/providers/fireblocks-resilience';

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
    private readonly client: FireblocksClientProvider,
    private readonly errorMapper: FireblocksErrorMapper,
    private readonly resilience: FireblocksResilience,
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
