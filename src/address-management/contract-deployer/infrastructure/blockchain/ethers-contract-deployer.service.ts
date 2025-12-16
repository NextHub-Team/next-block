import { Injectable, Logger } from '@nestjs/common';
import { ContractDeployerBlockchainPort } from '../../contract-deployer.blockchain';
import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';
import solc from 'solc';

type SolcOutput = {
  contracts?: Record<string, Record<string, any>>;
  errors?: Array<{ severity: string; formattedMessage: string }>;
};

@Injectable()
export class EthersContractDeployerService implements ContractDeployerBlockchainPort {
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
    compilerVersion?: string,
    constructorArgs: any[] = [],
  ): Promise<{ address: string; txHash: string }> {
    const contractsDir = path.resolve(
      process.cwd(),
      'src',
      'address-management',
      'contract-deployer',
      'contracts',
    );

    const contractFileName = `${contractName}.sol`;
    const contractPath = path.join(contractsDir, contractFileName);

    if (!fs.existsSync(contractsDir)) {
      throw new Error(`Contracts directory does not exist: ${contractsDir}`);
    }
    if (!fs.existsSync(contractPath)) {
      throw new Error(`Contract file not found: ${contractPath}`);
    }

    this.logger.log(
      `Compiling "${contractName}" from ${contractPath} (local solc; requested=${compilerVersion ?? 'n/a'})`,
    );

    const source = fs.readFileSync(contractPath, 'utf8');

    const input = {
      language: 'Solidity',
      sources: {
        [contractFileName]: { content: source },
      },
      settings: {
        optimizer: { enabled: true, runs: 200 },
        outputSelection: {
          '*': {
            '*': ['abi', 'evm.bytecode.object'],
          },
        },
      },
    };

    const findImports = (importPath: string) => {
      // 1) Resolve relative imports
      if (importPath.startsWith('./') || importPath.startsWith('../')) {
        const resolved = path.resolve(path.dirname(contractPath), importPath);
        if (fs.existsSync(resolved)) {
          return { contents: fs.readFileSync(resolved, 'utf8') };
        }
      }

      // 2) Resolve node_modules imports (e.g., @openzeppelin/...)
      const nmResolved = path.resolve(process.cwd(), 'node_modules', importPath);
      if (fs.existsSync(nmResolved)) {
        return { contents: fs.readFileSync(nmResolved, 'utf8') };
      }

      // 3) Fallback: try contractsDir direct
      const localResolved = path.resolve(contractsDir, importPath);
      if (fs.existsSync(localResolved)) {
        return { contents: fs.readFileSync(localResolved, 'utf8') };
      }

      return { error: `Import not found: ${importPath}` };
    };

    const raw = solc.compile(JSON.stringify(input), { import: findImports });
    const output = JSON.parse(raw) as SolcOutput;

    // Show compiler errors clearly
    if (output.errors?.length) {
      const errors = output.errors
        .filter((e) => e.severity === 'error')
        .map((e) => e.formattedMessage)
        .join('\n');

      const warnings = output.errors
        .filter((e) => e.severity !== 'error')
        .map((e) => e.formattedMessage)
        .join('\n');

      if (warnings) this.logger.warn(`Solc warnings:\n${warnings}`);
      if (errors) throw new Error(`Solc compilation failed:\n${errors}`);
    }

    const fileContracts = output.contracts?.[contractFileName];
    if (!fileContracts) {
      throw new Error(`No compiled contracts found for file: ${contractFileName}`);
    }

    const compiled = fileContracts[contractName];
    if (!compiled) {
      const available = Object.keys(fileContracts).join(', ');
      throw new Error(
        `Contract "${contractName}" not found in "${contractFileName}". Available: ${available}`,
      );
    }

    const abi = compiled.abi;
    const bytecode = compiled.evm?.bytecode?.object;

    if (!abi || !bytecode) {
      throw new Error(`ABI or bytecode missing for ${contractName}`);
    }


    const buildDir = path.resolve(
      process.cwd(),
      'build',
      'address-management',
      'contract-deployer',
    );

    if (!fs.existsSync(buildDir)) {
      fs.mkdirSync(buildDir, { recursive: true });
    }

    const abiFile = path.join(buildDir, `${contractName}.abi.json`);
    const bytecodeFile = path.join(buildDir, `${contractName}.bytecode.json`);

    fs.writeFileSync(abiFile, JSON.stringify(abi, null, 2));
    fs.writeFileSync(bytecodeFile, bytecode);

    this.logger.log(`Artifacts written: abi=${abiFile} bytecode=${bytecodeFile}`);

    // =========================================================

    this.logger.log(
      `${contractName} compiled successfully. Deploying with args: ${JSON.stringify(constructorArgs)}`,
    );

    const factory = new ethers.ContractFactory(abi, bytecode, this.wallet);

    // IMPORTANT: spread constructor args
    const contract = await factory.deploy(...constructorArgs);

    const deploymentTx = contract.deploymentTransaction();
    if (!deploymentTx) throw new Error('No deployment transaction found on contract instance');

    this.logger.log(`Deploy tx hash: ${deploymentTx.hash}, waiting for confirmation...`);

    const receipt = await deploymentTx.wait();
    if (!receipt) throw new Error('Deployment transaction not mined');

    if (receipt.status !== 1) {
      throw new Error(`Deployment failed. tx=${deploymentTx.hash} status=${receipt.status}`);
    }

    const address = contract.target.toString();
    this.logger.log(`Contract ${contractName} deployed at: ${address}`);

    return { address, txHash: deploymentTx.hash };
  }
}
