import { Module } from '@nestjs/common';
import { WhiteListAddressRepository } from '../white-list-address.repository';
import { WhiteListAddressRelationalRepository } from './repositories/white-list-address.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhiteListAddressEntity } from './entities/white-list-address.entity';

@Module({
	imports: [TypeOrmModule.forFeature([WhiteListAddressEntity])],
	providers: [
		{
			provide: WhiteListAddressRepository,
			useClass: WhiteListAddressRelationalRepository,
		},
	],
	exports: [WhiteListAddressRepository],
})
export class RelationalWhiteListAddressPersistenceModule {}
