import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';
import { RewardMintEventDto } from '../../dto/reward-mint-event.dto';

@Injectable()
export class AvaxRewardTokenAdapter {
  private readonly logger = new Logger(AvaxRewardTokenAdapter.name);

  private provider?: ethers.JsonRpcProvider;
  private wallet?: ethers.Wallet;
  private contract?: ethers.Contract;

  private readonly rewardTokenId = 1n;
  private readonly statusTokenId = 2n;


  private readonly abiPath = path.resolve(
    process.cwd(),
    'build',
    'address-management',
    'contract-deployer',
    'RewardToken.abi.json',
  );

  constructor() {

    const rpcUrl = process.env.RPC_URL;
    const pk = process.env.PRIVATE_KEY;
    const addr = process.env.REWARD_TOKEN_ADDRESS;

    if (!rpcUrl || !pk) {
      this.logger.warn('RPC_URL/PRIVATE_KEY not set at startup (this is OK; calls will fail until configured).');
    }
    if (!addr) {
      this.logger.warn('REWARD_TOKEN_ADDRESS not set at startup (this is OK; calls will fail until configured).');
    }
    if (!fs.existsSync(this.abiPath)) {
      this.logger.warn(`RewardToken ABI not found at startup (this is OK). Expected: ${this.abiPath}`);
    }
  }

  private resolveTokenId(tokenType: string): bigint {
    const t = (tokenType ?? '').toLowerCase();
    if (t === 'reward') return this.rewardTokenId;
    if (t === 'status') return this.statusTokenId;
    throw new Error(`Unsupported tokenType=${tokenType}`);
  }

  private normalizeAddress(addr: string): string {
    return ethers.getAddress(addr);
  }

  private getOrInitContract(): ethers.Contract {
    if (this.contract) return this.contract;

    const rpcUrl = process.env.RPC_URL;
    const privateKey = process.env.PRIVATE_KEY;
    const contractAddress = process.env.REWARD_TOKEN_ADDRESS;

 
    if (!rpcUrl || !privateKey || !contractAddress) {
      throw new Error('RewardTokenAdapter not configured: RPC_URL, PRIVATE_KEY, REWARD_TOKEN_ADDRESS must be set');
    }

    if (!fs.existsSync(this.abiPath)) {
      throw new Error(`RewardToken ABI not found at: ${this.abiPath}`);
    }

    const abi = JSON.parse(fs.readFileSync(this.abiPath, 'utf8'));

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
    this.contract = new ethers.Contract(contractAddress, abi, this.wallet);

    this.logger.log(
      `RewardToken connected at ${contractAddress} with signer ${this.wallet.address}`,
    );

    return this.contract;
  }

  async applyFromEvent(walletAddress: string, dto: RewardMintEventDto): Promise<void> {
    const to = this.normalizeAddress(walletAddress);
    const tokenId = this.resolveTokenId(dto.tokenType);
    const amount = BigInt(dto.points);

 
    const contract = this.getOrInitContract();

    if (dto.functionType === 'Transfer-In') {
      this.logger.log(`Minting ${dto.points} of tokenId=${tokenId.toString()} to wallet=${to}`);
      const tx = await contract.mint(to, tokenId, amount);
      await tx.wait();
      return;
    }

    if (dto.functionType === 'Transfer-Out') {
      this.logger.log(`Burning ${dto.points} of tokenId=${tokenId.toString()} from wallet=${to}`);
      const tx = await contract.burn(to, tokenId, amount);
      await tx.wait();
      return;
    }

    this.logger.warn(`Unsupported functionType=${dto.functionType} for userId=${dto.userId}`);
  }
}
