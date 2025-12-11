import { Injectable, Logger } from '@nestjs/common';
import { ContractDeployerBlockchainPort } from '../../contract-deployer.blockchain';
import { compile } from '@ethereum-waffle/compiler';
import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EthersContractDeployerService
  implements ContractDeployerBlockchainPort
{
  private readonly logger = new Logger(EthersContractDeployerService.name);
  private readonly provider: ethers.JsonRpcProvider;
  private readonly wallet: ethers.Wallet;

  constructor() {
    const rpcUrl = process.env.RPC_URL;
    const privateKey = process.env.PRIVATE_KEY;

    if (!rpcUrl || !privateKey) {
      throw new Error('RPC_URL and PRIVATE_KEY env vars are required');
    }

    this.logger.log(`Using RPC_URL: ${rpcUrl}`);

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
  }

  async compileAndDeploy(
    contractName: string,
    compilerVersion = '0.8.28',
  ): Promise<{ address: string }> {
    const contractsDir = path.resolve(
      process.cwd(),
      'src',
      'address-management',
      'contract-deployer',
      'contracts',
    );

    if (!fs.existsSync(contractsDir)) {
      throw new Error(
        `Contracts directory does not exist: ${contractsDir}. Please create it and add your .sol files.`,
      );
    }

    const contractFileName = `${contractName}.sol`;
    const contractPath = path.join(contractsDir, contractFileName);

    if (!fs.existsSync(contractPath)) {
      throw new Error(`Contract file not found: ${contractPath}`);
    }

    this.logger.log(
      `Compiling contract "${contractName}" from: ${contractPath} (solc ${compilerVersion})`,
    );

    const buildDir = path.resolve(
      process.cwd(),
      'build',
      'address-management',
      'contract-deployer',
    );
    if (!fs.existsSync(buildDir)) {
      fs.mkdirSync(buildDir, { recursive: true });
    }

    const nodeModulesDirectory = path.resolve(process.cwd(), 'node_modules');

    const output = await compile({
      sourceDirectory: contractsDir,
      compilerVersion,
      outputDirectory: buildDir,
      nodeModulesDirectory,
    });

    if (!output.contracts || Object.keys(output.contracts).length === 0) {
      throw new Error(
        `Compilation output is invalid. "contracts" field is missing or empty.`,
      );
    }

    const contractKey = Object.keys(output.contracts).find((key) =>
      key.endsWith(contractFileName),
    );

    if (!contractKey) {
      throw new Error(`Compiled output does not include ${contractFileName}`);
    }

    const compiled = (output.contracts as any)[contractKey]?.[contractName];
    if (!compiled) {
      throw new Error(`${contractName} not found in compiled output`);
    }

    const abi = compiled.abi;
    const bytecode = compiled.evm?.bytecode?.object;

    if (!abi || !bytecode) {
      throw new Error(`ABI or bytecode missing for ${contractName}`);
    }

    const abiFile = path.join(buildDir, `${contractName}.abi.json`);
    const bytecodeFile = path.join(buildDir, `${contractName}.bytecode.json`);

    fs.writeFileSync(abiFile, JSON.stringify(abi, null, 2));
    fs.writeFileSync(bytecodeFile, bytecode);

    this.logger.log(`${contractName} compiled successfully. Deploying...`);

    const factory = new ethers.ContractFactory(abi, bytecode, this.wallet);

    // 
    const contract = await factory.deploy('');

    const deploymentTx = contract.deploymentTransaction();
    if (!deploymentTx) {
      throw new Error('No deployment transaction found on contract instance');
    }

    this.logger.log(
      `Deploy tx hash: ${deploymentTx.hash}, waiting for confirmation...`,
    );


    const receipt = await this.provider.waitForTransaction(
      deploymentTx.hash,
      null,
      600_000,
    );

    if (!receipt) {
      throw new Error('Deployment transaction not mined within timeout');
    }

    this.logger.log(
      `Deploy tx mined. status=${receipt.status}, gasUsed=${receipt.gasUsed.toString()}`,
    );

    const address = contract.target.toString();
    this.logger.log(`Contract ${contractName} deployed at: ${address}`);

    return { address };
  }
}
