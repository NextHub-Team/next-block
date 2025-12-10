import { Injectable } from '@nestjs/common';
import { AbstractClientAdminService } from '../base/abstract-client-admin.service';
import { FireblocksClientService } from '../../shared/fireblocks-client.service';

@Injectable()
export class AdminDestinationsService extends AbstractClientAdminService {
  constructor(client: FireblocksClientService) {
    super(AdminDestinationsService.name, client);
  }

  async addDestination(name: string, address: string): Promise<void> {
    this.logAction(`Adding destination ${name}`);
    this.debug(`Destination address ${address}`);
    this.debugBasePath();
  }
}
