import { Module } from '@nestjs/common';
import { NftMintConsumer } from './nft-mint.consumer';
import { PinataService } from './services/pinata.service';
import { NftMintService } from './services/nft-mint.service';
// import { RmqProducerModule } from '../address-management/rmq/rmq-producer.module';

@Module({
  // imports: [RmqProducerModule],
  controllers: [NftMintConsumer],
  providers: [PinataService, NftMintService],
})
export class NftMintModule {}
