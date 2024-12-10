import { Module } from '@nestjs/common';
import { NftRepository } from '../nft.repository';
import { NftRelationalRepository } from './repositories/nft.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NftEntity } from './entities/nft.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NftEntity])],
  providers: [
    {
      provide: NftRepository,
      useClass: NftRelationalRepository,
    },
  ],
  exports: [NftRepository],
})
export class RelationalNftPersistenceModule {}
