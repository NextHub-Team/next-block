import { Module } from '@nestjs/common';
import { NftMintConsumer } from './nft-mint.consumer';
import { CustodialWalletsModule } from '../../custodial-wallets/custodial-wallets.module';
import { PinataModule } from '../../providers/pinata/pinata.module';
import { NftDeployService } from './services/nft-deploy.service';
import { NftDeployController } from './nft-deploy.controller';
// import { RmqProducerModule } from '../address-management/rmq/rmq-producer.module';

@Module({
  // imports: [RmqProducerModule],
  imports: [CustodialWalletsModule, PinataModule],
  controllers: [NftMintConsumer, NftDeployController],
  providers: [NftDeployService],
})
export class NftMintModule {}
