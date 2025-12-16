
import { Inject, Injectable, Optional } from '@nestjs/common';
import { CONTRACT_DEPLOYER_BLOCKCHAIN, ContractDeployerBlockchainPort } from './contract-deployer.blockchain';
import { DeployedContract } from './domain/deployed-contract';
import { ContractDeployerRepository } from './contract-deployer.repository';

@Injectable()
export class ContractDeployerService {
  constructor(
    @Inject(CONTRACT_DEPLOYER_BLOCKCHAIN)
    private readonly blockchainDeployer: ContractDeployerBlockchainPort,

    @Optional()
    @Inject(ContractDeployerRepository)
    private readonly repository?: ContractDeployerRepository,
  ) {}

  async deployContract(
    contractName: string,
    compilerVersion?: string,
    constructorArgs: any[] = [],
  ): Promise<DeployedContract> {
    const result = await this.blockchainDeployer.compileAndDeploy(
      contractName,
      compilerVersion,
      constructorArgs,
    );

    const deployed = new DeployedContract({
      address: result.address,
      name: contractName,
      network: 'avax-fuji', // TODO: move to config later
    });

    if (this.repository) {
      await this.repository.save(deployed);
    }

    return deployed;
  }
}

