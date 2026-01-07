import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetRegistryEntity } from '../../../../asset-registries/infrastructure/persistence/relational/entities/asset-registry.entity';
import { AssetRegistrySeedService } from './asset-registry-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([AssetRegistryEntity])],
  providers: [AssetRegistrySeedService],
  exports: [AssetRegistrySeedService],
})
export class AssetRegistrySeedModule {}
