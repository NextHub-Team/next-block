import { Module } from '@nestjs/common';
import { AssetRegistryRepository } from '../asset-registry.repository';
import { AssetRegistryRelationalRepository } from './repositories/asset-registry.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetRegistryEntity } from './entities/asset-registry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AssetRegistryEntity])],
  providers: [
    {
      provide: AssetRegistryRepository,
      useClass: AssetRegistryRelationalRepository,
    },
  ],
  exports: [AssetRegistryRepository],
})
export class RelationalAssetRegistryPersistenceModule {}
