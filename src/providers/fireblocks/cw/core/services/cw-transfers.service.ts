import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { FireblocksCwService } from '../../fireblocks-cw.service';
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
    @Inject(forwardRef(() => FireblocksCwService))
    private readonly client: FireblocksCwService,
    private readonly errorMapper: FireblocksErrorMapper,
    private readonly resilience: FireblocksResilienceService,
  ) {}
}
