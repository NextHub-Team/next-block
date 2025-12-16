import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';
import { RewardMintEventDto } from '../../dto/reward-mint-event.dto';

@Injectable()
export class AvaxRewardTokenAdapter {
  private readonly logger = new Logger(AvaxRewardTokenAdapter.name);
  private readonly provider: ethers.JsonRpcProvider;
  private readonly wallet: ethers.Wallet;
  private readonly contract: ethers.Contract;

  private readonly rewardTokenId = 1n;
  private readonly statusTokenId = 2n;

  constructor() {
    const rpcUrl = process.env.RPC_URL;
    const privateKey = process.env.PRIVATE_KEY;
    const contractAddress = process.env.REWARD_TOKEN_ADDRESS;

    if (!rpcUrl || !privateKey || !contractAddress) {
      throw new Error('RPC_URL, PRIVATE_KEY and REWARD_TOKEN_ADDRESS must be set');
    }

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);

    const abiPath = path.resolve(
      process.cwd(),
      'build',
      'address-management',
      'contract-deployer',
      'RewardToken.abi.json',
    );

    if (!fs.existsSync(abiPath)) {
      throw new Error(`RewardToken ABI not found at: ${abiPath}`);
    }

    const abi = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
    this.contract = new ethers.Contract(contractAddress, abi, this.wallet);

    this.logger.log(
      `RewardToken connected at ${contractAddress} with signer ${this.wallet.address}`,
    );
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

  async applyFromEvent(walletAddress: string, dto: RewardMintEventDto): Promise<void> {
    const to = this.normalizeAddress(walletAddress);
    const tokenId = this.resolveTokenId(dto.tokenType);
    const amount = BigInt(dto.points);

    if (dto.functionType === 'Transfer-In') {
      this.logger.log(
        `Minting ${dto.points} of tokenId=${tokenId.toString()} to wallet=${to}`,
      );
      const tx = await this.contract.mint(to, tokenId, amount);
      await tx.wait();
      return;
    }

    if (dto.functionType === 'Transfer-Out') {
      this.logger.log(
        `Burning ${dto.points} of tokenId=${tokenId.toString()} from wallet=${to}`,
      );
      const tx = await this.contract.burn(to, tokenId, amount);
      await tx.wait();
      return;
    }

    this.logger.warn(
      `Unsupported functionType=${dto.functionType} for userId=${dto.userId}`,
    );
  }
}
