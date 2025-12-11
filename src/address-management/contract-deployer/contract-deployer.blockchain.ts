export interface ContractDeployerBlockchainPort {
  compileAndDeploy(
    contractName: string,
    compilerVersion?: string,
  ): Promise<{ address: string }>;
}

export const CONTRACT_DEPLOYER_BLOCKCHAIN = 'CONTRACT_DEPLOYER_BLOCKCHAIN';
