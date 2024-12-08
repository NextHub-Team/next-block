import { Module } from '@nestjs/common';
import { SupportedAssetRepository } from '../supported-asset.repository';
import { SupportedAssetRelationalRepository } from './repositories/supported-asset.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportedAssetEntity } from './entities/supported-asset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SupportedAssetEntity])],
  providers: [
    {
      provide: SupportedAssetRepository,
      useClass: SupportedAssetRelationalRepository,
    },
  ],
  exports: [SupportedAssetRepository],
})
export class RelationalSupportedAssetPersistenceModule {}
