import { Module } from '@nestjs/common';
import { SupportedAssetsService } from './supported-assets.service';
import { SupportedAssetsController } from './supported-assets.controller';
import { RelationalSupportedAssetPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
	imports: [
		// import modules, etc.
		RelationalSupportedAssetPersistenceModule,
	],
	controllers: [SupportedAssetsController],
	providers: [SupportedAssetsService],
	exports: [SupportedAssetsService, RelationalSupportedAssetPersistenceModule],
})
export class SupportedAssetsModule {}
