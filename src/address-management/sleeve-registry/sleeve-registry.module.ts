import { Module } from '@nestjs/common';
import { SleeveContractService } from './sleeve-contract.service';
import { SleeveRegistryController } from './sleeve-registry.controller';
import { ContractDeployerModule } from '../contract-deployer/contract-deployer.module';

@Module({
  imports: [ContractDeployerModule],
  controllers: [SleeveRegistryController],
  providers: [SleeveContractService],
  exports: [SleeveContractService],
})
export class SleeveRegistryModule {}
