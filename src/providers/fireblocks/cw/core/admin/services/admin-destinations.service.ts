import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../../../../../config/config.type';
import { AbstractCwService } from '../base/abstract-cw.service';

@Injectable()
export class AdminDestinationsService extends AbstractCwService {
  constructor(configService: ConfigService<AllConfigType>) {
    super(AdminDestinationsService.name, configService);
  }

  async addDestination(name: string, address: string): Promise<void> {
    this.logAction(`Adding destination ${name}`);
    this.debug(`Destination address ${address}`);
    this.debugEnvironment();
  }
}
