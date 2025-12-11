import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../../../../../config/config.type';
import { AbstractCwService } from '../base/abstract-cw.service';

@Injectable()
export class AdminAuditService extends AbstractCwService {
  constructor(configService: ConfigService<AllConfigType>) {
    super(AdminAuditService.name, configService);
  }

  async getLogs(): Promise<void> {
    this.logAction('Retrieving system audit logs');
    this.debugEnvironment();
  }
}
