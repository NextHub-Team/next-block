import { Module } from '@nestjs/common';
import { StatusesService } from './statuses.service';
import { StatusesController } from './statuses.controller';
import { RelationalStatusPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
	imports: [
		// import modules, etc.
		RelationalStatusPersistenceModule,
	],
	controllers: [StatusesController],
	providers: [StatusesService],
	exports: [StatusesService, RelationalStatusPersistenceModule],
})
export class StatusesModule {}
