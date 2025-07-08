import { Injectable, Logger } from '@nestjs/common';
import { deployNFTContract } from '../hardhat/scripts/deploy-nft.script';

@Injectable()
export class NftDeployService {
  private readonly logger = new Logger(NftDeployService.name);

  async deploy(name: string, symbol: string): Promise<string> {
    try {
      const providerUrl = process.env.SEPOLIA_RPC_URL!;
      const privateKey = process.env.TREASURY_PRIVATE_KEY!;

      this.logger.log(`Deploying contract with name=${name} symbol=${symbol}`);
      const address = await deployNFTContract(
        providerUrl,
        privateKey,
        name,
        symbol,
      );

      this.logger.log(`Deployed at address: ${address}`);
      return address;
    } catch (error) {
      this.logger.error(`Deployment failed: ${error.message}`);
      throw error;
    }
  }
}
