import { Module } from '@nestjs/common';
import { WhiteListAddressesService } from './white-list-addresses.service';
import { WhiteListAddressesController } from './white-list-addresses.controller';
import { RelationalWhiteListAddressPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
	imports: [
		// import modules, etc.
		RelationalWhiteListAddressPersistenceModule,
	],
	controllers: [WhiteListAddressesController],
	providers: [WhiteListAddressesService],
	exports: [
		WhiteListAddressesService,
		RelationalWhiteListAddressPersistenceModule,
	],
})
export class WhiteListAddressesModule {}
