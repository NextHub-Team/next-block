import { Injectable, Logger } from '@nestjs/common';
import { FireblocksClientProvider } from '../providers/fireblocks-client.provider';

@Injectable()
export class AdminGasOperationsService {
  private readonly logger = new Logger(AdminGasOperationsService.name);

  constructor(private readonly client: FireblocksClientProvider) {}

  async getGasStationByAsset(assetId: string): Promise<void> {
    this.logger.log(`Retrieve gas station for ${assetId}`);
    this.logger.debug(`Using basePath ${this.client.getOptions().basePath}`);
  }

  async updateGasStationConfiguration(assetId: string): Promise<void> {
    this.logger.log(`Update gas station config for ${assetId}`);
  }
}
