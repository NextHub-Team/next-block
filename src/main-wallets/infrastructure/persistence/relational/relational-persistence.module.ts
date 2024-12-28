import { Module } from '@nestjs/common';
import { MainWalletRepository } from '../main-wallet.repository';
import { MainWalletRelationalRepository } from './repositories/main-wallet.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainWalletEntity } from './entities/main-wallet.entity';

@Module({
	imports: [TypeOrmModule.forFeature([MainWalletEntity])],
	providers: [
		{
			provide: MainWalletRepository,
			useClass: MainWalletRelationalRepository,
		},
	],
	exports: [MainWalletRepository],
})
export class RelationalMainWalletPersistenceModule {}
