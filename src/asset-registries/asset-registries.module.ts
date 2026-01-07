import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { AssetRegistriesService } from './asset-registries.service';
import { AssetRegistriesController } from './asset-registries.controller';
import { RelationalAssetRegistryPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // do not remove this comment
    RelationalAssetRegistryPersistenceModule,
  ],
  controllers: [AssetRegistriesController],
  providers: [AssetRegistriesService],
  exports: [AssetRegistriesService, RelationalAssetRegistryPersistenceModule],
})
export class AssetRegistriesModule {}
