export interface ContractDeployerBlockchainPort {
  compileAndDeploy(
    contractName: string,
    compilerVersion?: string,
    constructorArgs?: any[],
  ): Promise<{ address: string; txHash: string }>;
}

export const CONTRACT_DEPLOYER_BLOCKCHAIN = 'CONTRACT_DEPLOYER_BLOCKCHAIN';
