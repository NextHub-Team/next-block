import {
  Module,
} from '@nestjs/common';
import { ContractDeployerController } from './contract-deployer.controller';
import { ContractDeployerService } from './contract-deployer.service';
import { EthersContractDeployerService } from './infrastructure/blockchain/ethers-contract-deployer.service';
import { CONTRACT_DEPLOYER_BLOCKCHAIN } from './contract-deployer.blockchain';

@Module({
  imports: [
  ],
  controllers: [ContractDeployerController],
  providers: [
    ContractDeployerService,
    EthersContractDeployerService,
    {
      provide: CONTRACT_DEPLOYER_BLOCKCHAIN,
      useExisting: EthersContractDeployerService,
    },
  ],
  exports: [
    ContractDeployerService,
  ],
})
export class ContractDeployerModule {}
