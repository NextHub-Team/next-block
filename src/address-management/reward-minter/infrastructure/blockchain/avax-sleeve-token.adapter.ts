import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';
import { RewardMintEventDto } from '../../dto/reward-mint-event.dto';

export enum SleeveTokenType {
  Reward = 'reward',
  Status = 'status',
  Subscription = 'subscription',
}

export enum SleeveFunctionType {
  TransferIn = 'Transfer-In',
  TransferOut = 'Transfer-Out',
}

type NormalizedEvent = {
  functionType: SleeveFunctionType;
  tokenType: SleeveTokenType;
  points: bigint;
};

@Injectable()
export class AvaxSleeveTokenAdapter {
  private readonly logger = new Logger(AvaxSleeveTokenAdapter.name);

  private readonly abiPath = path.resolve(
    process.cwd(),
    'build',
    'address-management',
    'contract-deployer',
    'SleeveToken.abi.json',
  );

  private provider?: ethers.JsonRpcProvider;
  private wallet?: ethers.Wallet;
  private abi: any[] | null = null;

  private getRpcUrl(): string {
    const rpcUrl = process.env.RPC_URL;
    if (!rpcUrl) throw new Error('RPC_URL must be set');
    return rpcUrl;
  }

  private getProvider(): ethers.JsonRpcProvider {
    if (this.provider) return this.provider;

    const rpcUrl = this.getRpcUrl();

    const network = ethers.Network.from(43113);
    const fetchRequest = new ethers.FetchRequest(rpcUrl);
    fetchRequest.timeout = 20_000;

    this.provider = new ethers.JsonRpcProvider(fetchRequest, network, {
      staticNetwork: network,
    });

    return this.provider;
  }

  private getWallet(): ethers.Wallet {
    if (this.wallet) return this.wallet;

    const pk = process.env.PRIVATE_KEY;
    if (!pk) throw new Error('PRIVATE_KEY must be set');

    this.wallet = new ethers.Wallet(pk, this.getProvider());
    this.logger.log(`Signer=${this.wallet.address}`);

    return this.wallet;
  }

  private getAbi(): any[] {
    if (this.abi) return this.abi;

    if (!fs.existsSync(this.abiPath)) {
      throw new Error(`SleeveToken ABI not found at: ${this.abiPath}`);
    }

    const parsed = JSON.parse(fs.readFileSync(this.abiPath, 'utf8'));
    if (!Array.isArray(parsed)) {
      throw new Error(`Invalid ABI JSON (expected array) at: ${this.abiPath}`);
    }

    this.abi = parsed;
    return this.abi;
  }

  private getReadContract(contractAddress: string): ethers.Contract {
    return new ethers.Contract(
      ethers.getAddress(contractAddress),
      this.getAbi(),
      this.getProvider(),
    );
  }

  private getWriteContract(contractAddress: string): ethers.Contract {
    return new ethers.Contract(
      ethers.getAddress(contractAddress),
      this.getAbi(),
      this.getWallet(),
    );
  }

  private normalizeTokenType(input: unknown): SleeveTokenType {
    if (typeof input === 'number') {
      if (input === 1) return SleeveTokenType.Reward;
      if (input === 2) return SleeveTokenType.Status;
      if (input === 3) return SleeveTokenType.Subscription;
      throw new Error(`Invalid tokenType id=${input}`);
    }

    const t = String(input ?? '').toLowerCase().trim();
    if (t === SleeveTokenType.Reward) return SleeveTokenType.Reward;
    if (t === SleeveTokenType.Status) return SleeveTokenType.Status;
    if (t === SleeveTokenType.Subscription) return SleeveTokenType.Subscription;

    throw new Error(`Invalid tokenType=${String(input)}`);
  }

  private normalizeFunctionType(input: unknown): SleeveFunctionType {
    if (typeof input === 'number') {
      if (input === 1) return SleeveFunctionType.TransferIn;
      if (input === 2) return SleeveFunctionType.TransferOut;
      throw new Error(`Invalid functionType id=${input}`);
    }

    const t = String(input ?? '').trim();
    if (t === SleeveFunctionType.TransferIn) return SleeveFunctionType.TransferIn;
    if (t === SleeveFunctionType.TransferOut) return SleeveFunctionType.TransferOut;

    throw new Error(`Invalid functionType=${String(input)}`);
  }

  private resolveTokenId(tokenType: SleeveTokenType): bigint {
    if (tokenType === SleeveTokenType.Reward) return 1n;
    if (tokenType === SleeveTokenType.Status) return 2n;
    if (tokenType === SleeveTokenType.Subscription) return 3n;
    throw new Error(`Unsupported tokenType=${tokenType}`);
  }

  private normalizeEvent(dto: RewardMintEventDto): NormalizedEvent {
    const functionType = this.normalizeFunctionType((dto as any).functionType);
    const tokenType = this.normalizeTokenType((dto as any).tokenType);

    const points = BigInt(dto.points);
    if (points <= 0n) throw new Error(`points must be > 0. got=${dto.points}`);

    return { functionType, tokenType, points };
  }

  private async waitWithTimeout(
    tx: ethers.ContractTransactionResponse,
    timeoutMs: number,
  ): Promise<ethers.ContractTransactionReceipt> {
    const receipt = await tx.wait(1, timeoutMs);
    if (!receipt) throw new Error(`Transaction not mined within timeout. tx=${tx.hash}`);
    if (receipt.status !== 1) throw new Error(`Transaction failed. tx=${tx.hash} status=${receipt.status}`);
    return receipt;
  }

  async applyEvent(
    contractAddress: string,
    walletAddress: string,
    dto: RewardMintEventDto,
  ): Promise<void> {
    const contractAddr = ethers.getAddress(contractAddress);
    const userAddr = ethers.getAddress(walletAddress);

    const normalized = this.normalizeEvent(dto);
    const tokenId = this.resolveTokenId(normalized.tokenType);
    const amount = normalized.points;

    this.logger.log(
      `applyEvent start contract=${contractAddr} user=${userAddr} type=${normalized.tokenType} id=${tokenId.toString()} amount=${amount.toString()} fn=${normalized.functionType}`,
    );

    if (normalized.functionType === SleeveFunctionType.TransferIn) {
      const contract = this.getWriteContract(contractAddr);
      this.logger.log(`Sending mint...`);
      const tx = await contract.mint(userAddr, tokenId, amount);
      this.logger.log(`mint tx=${tx.hash} waiting...`);
      const receipt = await this.waitWithTimeout(tx, 180_000);
      this.logger.log(`mint mined tx=${tx.hash} block=${receipt.blockNumber}`);
      return;
    }

    if (normalized.functionType === SleeveFunctionType.TransferOut) {
      this.logger.log(`Pre-checking balance before burn...`);

      const read = this.getReadContract(contractAddr);
      const current = await read.balanceOf(userAddr, tokenId);
      const currentBal = BigInt(current);

      if (currentBal < amount) {
        throw new Error(
          `Insufficient balance for burn. wallet=${userAddr} tokenType=${normalized.tokenType} tokenId=${tokenId.toString()} current=${currentBal.toString()} requested=${amount.toString()}`,
        );
      }

      const contract = this.getWriteContract(contractAddr);
      this.logger.log(`Sending burn...`);
      const tx = await contract.burn(userAddr, tokenId, amount);
      this.logger.log(`burn tx=${tx.hash} waiting...`);
      const receipt = await this.waitWithTimeout(tx, 180_000);
      this.logger.log(`burn mined tx=${tx.hash} block=${receipt.blockNumber}`);
      return;
    }

    throw new Error(`Unsupported functionType=${normalized.functionType}`);
  }

  async getBalance(
    contractAddress: string,
    walletAddress: string,
    tokenType: SleeveTokenType,
  ): Promise<bigint> {
    const c = this.getReadContract(contractAddress);
    const userAddr = ethers.getAddress(walletAddress);
    const tokenId = this.resolveTokenId(tokenType);
    const bal = await c.balanceOf(userAddr, tokenId);
    return BigInt(bal);
  }

  async getAllBalances(
    contractAddress: string,
    walletAddress: string,
  ): Promise<{ reward: bigint; status: bigint; subscription: bigint }> {
    const c = this.getReadContract(contractAddress);
    const userAddr = ethers.getAddress(walletAddress);

    const [r, s, sub] = await Promise.all([
      c.balanceOf(userAddr, 1n),
      c.balanceOf(userAddr, 2n),
      c.balanceOf(userAddr, 3n),
    ]);

    return { reward: BigInt(r), status: BigInt(s), subscription: BigInt(sub) };
  }
}
