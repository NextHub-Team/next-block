import { Injectable } from '@nestjs/common';
import { AbstractCwService } from '../../base/abstract-cw.service';
import { FireblocksErrorMapper } from '../../../infrastructure/persistence/relational/mappers/fireblocks-error.mapper';

@Injectable()
export class AdminWithdrawalsService extends AbstractCwService {
  constructor(private readonly errorMapper: FireblocksErrorMapper) {
    super(AdminWithdrawalsService.name);
  }
}
