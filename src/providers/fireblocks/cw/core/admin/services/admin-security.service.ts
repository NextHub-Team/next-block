import { Injectable } from '@nestjs/common';
import { AbstractCwService } from '../../base/abstract-cw.service';
import { FireblocksResilienceService } from '../../shared/fireblocks-resilience.service';

@Injectable()
export class AdminSecurityService extends AbstractCwService {
  constructor(private readonly resilience: FireblocksResilienceService) {
    super(AdminSecurityService.name);
  }
}
