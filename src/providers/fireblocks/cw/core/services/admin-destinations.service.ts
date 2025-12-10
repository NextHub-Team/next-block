import { Injectable, Logger } from '@nestjs/common';
import { FireblocksClientService } from '../shared/fireblocks-client.service';

@Injectable()
export class AdminDestinationsService {
  private readonly logger = new Logger(AdminDestinationsService.name);

  constructor(private readonly client: FireblocksClientService) {}

  async addDestination(name: string, address: string): Promise<void> {
    this.logger.log(`Adding destination ${name}`);
    this.logger.debug(`Destination address ${address}`);
    this.logger.debug(`Using basePath ${this.client.getOptions().basePath}`);
  }
}
