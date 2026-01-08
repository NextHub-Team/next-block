import { AssetRegistriesModule } from '../asset-registries/asset-registries.module';
import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { SleevesService } from './sleeves.service';
import { SleevesController } from './sleeves.controller';
import { RelationalSleevesPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    AssetRegistriesModule,

    // do not remove this comment
    RelationalSleevesPersistenceModule,
  ],
  controllers: [SleevesController],
  providers: [SleevesService],
  exports: [SleevesService, RelationalSleevesPersistenceModule],
})
export class SleevesModule {}
