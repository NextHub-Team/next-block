import { Controller, Logger, OnModuleInit } from '@nestjs/common';
import { PinataService } from '../../providers/pinata/pinata.service';
import { ethers } from 'ethers';
import { EventEmitter2 } from '@nestjs/event-emitter';
// import { ConsumeMessage } from 'amqplib';
import { RmqEventPayload } from '../../communication/rabbitMQ/types/rabbitmq-interface.type';
import { Acknowledge } from '../../communication/rabbitMQ/utils/rabbitmq.helper';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../config/config.type';
import { RMQ_NO_ACK } from '../../communication/rabbitMQ/types/rabbitmq-const.type';
import { CustodialWalletsService } from '../../custodial-wallets/custodial-wallets.service';

const CONTRACT_ADDRESS = '0xe7F80c50C24B48146495ca6CC327d746e0dbE8E5';
const RPC_URL = process.env.SEPOLIA_RPC_URL!;
const PRIVATE_KEY = process.env.TREASURY_PRIVATE_KEY!;

const ABI = [
  {
    inputs: [
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'string', name: 'symbol', type: 'string' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'string', name: 'tokenURI', type: 'string' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

@Controller()
export class NftMintConsumer implements OnModuleInit {
  private readonly logger = new Logger(NftMintConsumer.name);
  private readonly provider = new ethers.JsonRpcProvider(RPC_URL);
  private readonly signer = new ethers.Wallet(PRIVATE_KEY, this.provider);
  private readonly contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    ABI,
    this.signer,
  );
  private readonly noAck: boolean;

  constructor(
    private readonly pinataService: PinataService,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly custodialWalletsService: CustodialWalletsService,
  ) {
    this.noAck = this.configService.get('rabbitMQ.noAck', RMQ_NO_ACK, {
      infer: true,
    });
  }

  onModuleInit() {
    this.eventEmitter.on('default.mint', this.handleMintEvent.bind(this));
  }

  private async handleMintEvent(event: RmqEventPayload) {
    const { payload, context } = event;
    await Acknowledge(
      context,
      async () => {
        try {
          await this.handleNftMint(payload);
          this.logger.debug(`NFT mint preparation done`);
        } catch (err) {
          this.logger.error(`Error during NFT mint prep: ${err.message}`);
          throw err;
        }
        this.logger.log('Processing completed.');
      },
      this.noAck,
    );
  }
  private async handleNftMint(payload: any) {
    const items = this.extractItems(payload);
    if (!items.length) {
      this.logger.warn('No valid NFT data found in payload');
      return;
    }

    let resolvedList: { uid: string; vaultId: string; address: string }[];
    try {
      const uids = items.map((item) => item.uid);
      resolvedList =
        (await this.custodialWalletsService.resolveAddressBySocialId(uids)) as {
          uid: string;
          vaultId: string;
          address: string;
        }[];
    } catch (err) {
      this.logger.error(`Error resolving addresses: ${err.message}`);
      return;
    }

    for (const item of items) {
      try {
        const resolved = resolvedList.find((r) => r.uid === item.uid);
        if (!resolved) {
          this.logger.warn(`No wallet found for UID ${item.uid}`);
          continue;
        }

        const pinataResult =
          await this.pinataService.pinImageAndMetadataFromUrl({
            imageUrl: item.image_url,
            metadata: item.metadata,
          });

        const tokenURI = `ipfs://${pinataResult.metadataIpfsHash}`;
        const tx = await this.contract.mint(resolved.address, tokenURI);
        const receipt = await tx.wait();

        const imageUrl = `ipfs://${pinataResult.imageIpfsHash}`;

        this.logger.log(
          `[MINT SUCCESS] Contract: ${CONTRACT_ADDRESS} | Wallet: ${resolved.address} | UID: ${item.uid} | TxHash: ${tx.hash} | Block: ${receipt.blockNumber} | Image: ${imageUrl}`,
        );
      } catch (err) {
        this.logger.error(`[MINT ERROR] UID: ${item.uid} | ${err.message}`);
      }
    }
  }

  private extractItems(payload: any): any[] {
    if (Array.isArray(payload)) {
      return payload;
    } else if (Array.isArray(payload.items)) {
      return payload.items;
    } else if (payload.uid) {
      return [payload];
    }
    return [];
  }
}
