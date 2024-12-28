import { Module } from '@nestjs/common';
import { PassphrasesService } from './passphrases.service';
import { PassphrasesController } from './passphrases.controller';
import { RelationalPassphrasePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
	imports: [
		// import modules, etc.
		RelationalPassphrasePersistenceModule,
	],
	controllers: [PassphrasesController],
	providers: [PassphrasesService],
	exports: [PassphrasesService, RelationalPassphrasePersistenceModule],
})
export class PassphrasesModule {}
