import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../../../../../config/config.type';
import { AbstractCwService } from '../../base/abstract-cw.service';

@Injectable()
export class AdminGasOperationsService extends AbstractCwService {
  constructor(configService: ConfigService<AllConfigType>) {
    super(AdminGasOperationsService.name, configService);
  }
}
