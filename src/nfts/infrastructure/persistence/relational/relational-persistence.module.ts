import { Module } from '@nestjs/common';
import { NFTRepository } from '../nft.repository';
import { NFTRelationalRepository } from './repositories/nft.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NFTEntity } from './entities/nft.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NFTEntity])],
  providers: [
    {
      provide: NFTRepository,
      useClass: NFTRelationalRepository,
    },
  ],
  exports: [NFTRepository],
})
export class RelationalNFTPersistenceModule {}
