import { Module } from '@nestjs/common';
import { CustodialWalletRepository } from '../custodial-wallet.repository';
import { CustodialWalletRelationalRepository } from './repositories/custodial-wallet.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustodialWalletEntity } from './entities/custodial-wallet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustodialWalletEntity])],
  providers: [
    {
      provide: CustodialWalletRepository,
      useClass: CustodialWalletRelationalRepository,
    },
  ],
  exports: [CustodialWalletRepository],
})
export class RelationalCustodialWalletPersistenceModule {}
