import { Module } from '@nestjs/common';
import { NFTsService } from './nfts.service';
import { NFTsController } from './nfts.controller';
import { RelationalNFTPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // import modules, etc.
    RelationalNFTPersistenceModule,
  ],
  controllers: [NFTsController],
  providers: [NFTsService],
  exports: [NFTsService, RelationalNFTPersistenceModule],
})
export class NFTsModule {}
