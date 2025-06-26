import { Injectable, Logger } from '@nestjs/common';
import { getSigner } from '../utils/ethers.provider';
import { ethers } from 'ethers';
import { toJson } from '../utils/abi';

const CONTRACT_ADDRESS = '0xf4c0840e8c0aa6c8e85b4bcdf9a2411f30022fc1';
const ABI = toJson(
  'function mint(to: address, tokenURI: string):() nonpayable',
);

@Injectable()
export class NftMintService {
  private readonly logger = new Logger(NftMintService.name);

  async mint(to: string, tokenURI: string) {
    const signer = getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    try {
      const tx = await contract.mint(to, tokenURI);
      this.logger.log(`Minting tx sent: ${tx.hash}`);

      const receipt = await tx.wait();
      this.logger.log(`Minted in block: ${receipt.blockNumber}`);
    } catch (err) {
      this.logger.error(`Mint failed: ${err.message}`);
    }
  }
}
