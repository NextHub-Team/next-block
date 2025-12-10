import { Injectable } from '@nestjs/common';
import { AbstractCwService } from '../base/abstract-cw.service';
import { FireblocksCwService } from '../../../fireblocks-cw.service';

@Injectable()
export class AdminDestinationsService extends AbstractCwService {
  constructor(client: FireblocksCwService) {
    super(AdminDestinationsService.name, client);
  }

  async addDestination(name: string, address: string): Promise<void> {
    this.logAction(`Adding destination ${name}`);
    this.debug(`Destination address ${address}`);
    this.debugBasePath();
  }
}
