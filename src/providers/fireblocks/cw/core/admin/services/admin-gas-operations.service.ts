import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../../../../../config/config.type';
import { AbstractCwService } from '../base/abstract-cw.service';

@Injectable()
export class AdminGasOperationsService extends AbstractCwService {
  constructor(configService: ConfigService<AllConfigType>) {
    super(AdminGasOperationsService.name, configService);
  }

  async allocateGas(vaultAccountId: string, amount: string): Promise<void> {
    this.logAction(`Allocating gas ${amount} to vault ${vaultAccountId}`);
    this.debugBasePath();
  }
}
