import { Controller, Logger } from '@nestjs/common';
import {
  EventPattern,
  MessagePattern,
  Payload,
  Ctx,
  RmqContext,
} from '@nestjs/microservices';
import axios from 'axios';
import { NftMintEventDto } from './dto/nft-mint.dto';
import { PinataService } from './services/pinata.service';
// import { RmqPublisherService } from '../address-management/rmq/rmq-publisher.service';
import { toJson } from '../address-management/utils/abi';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '0xf4c0840e8c0aa6c8e85b4bcdf9a2411f30022fc1';
const RPC_URL = process.env.SEPOLIA_RPC_URL!;
const PRIVATE_KEY = process.env.TREASURY_PRIVATE_KEY!;

function detectAssetType(
  url: string,
): 'image' | 'audio' | 'video' | 'document' | 'other' {
  const ext = url.split('.').pop()?.toLowerCase() || '';
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext))
    return 'image';
  if (['mp3', 'wav', 'ogg'].includes(ext)) return 'audio';
  if (['mp4', 'avi', 'mov', 'webm'].includes(ext)) return 'video';
  if (['pdf', 'doc', 'docx', 'ppt', 'pptx'].includes(ext)) return 'document';
  return 'other';
}

@Controller()
export class NftMintConsumer {
  private readonly logger = new Logger(NftMintConsumer.name);
  private readonly provider = new ethers.JsonRpcProvider(RPC_URL);
  private readonly signer = new ethers.Wallet(PRIVATE_KEY, this.provider);
  private readonly abi = toJson(
    'function mint(uris: string[], datas: string[], royaltyWallets: address[], royaltyPercentages: uint256[], paymentMethodName: string):() payable',
  );
  private readonly contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    this.abi,
    this.signer,
  );

  constructor(
    private readonly pinataService: PinataService,
    // private readonly rmqPublisherService: RmqPublisherService,
  ) {}

  @EventPattern('drop.mint')
  async handleNftMint(
    @Payload() data: NftMintEventDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      this.logger.log('Received drop.mint event');

      for (const nft of data.nfts ?? []) {
        try {
          const { uid, image_url, metadata } = nft;

          // Step 1: Get wallet info
          const walletRes = await axios.get(
            `https://vaultapi.veropulse.com/cw/vaults/name?name=${uid}`,
          );
          const walletAddress = walletRes.data.address;
          const vaultId = walletRes.data.vaultId;
          const sub = walletRes.data.vaultName;
          this.logger.log(`Wallet address for ${uid}: ${walletAddress}`);

          // Step 2: Upload metadata to Pinata
          const metadataWithImage = { ...metadata, image: image_url };
          const uploaded =
            await this.pinataService.uploadJson(metadataWithImage);
          this.logger.log(`Pinata Metadata CID: ${uploaded.cid}`);
          this.logger.log(`Pinata Metadata URL: ${uploaded.url}`);

          // Step 3: Mint NFT
          const uris = [`ipfs://${uploaded.cid}`];
          const datas: string[] = [];
          const royaltyWallets: string[] = [];
          const royaltyPercentages: number[] = [0];
          const paymentMethodName = 'WEI';

          const tx = await this.contract.mint(
            uris,
            datas,
            royaltyWallets,
            royaltyPercentages,
            paymentMethodName,
            { value: ethers.parseEther('0') },
          );
          this.logger.log(`Minting tx sent: ${tx.hash}`);

          const receipt = await tx.wait();
          const blockNumber = receipt.blockNumber;
          this.logger.log(`Minted in block: ${blockNumber}`);

          // Step 4: Save to DB
          const nftData = {
            imageCid: uploaded.cid,
            imageUrl: image_url,
            contractAddress: CONTRACT_ADDRESS,
            txid: tx.hash,
            blockNumber: blockNumber.toString(),
            sub,
            vaultId,
            assetType: detectAssetType(image_url),
          };

          await axios.post('https://vaultapi.veropulse.com/cw/nfts', nftData);
          this.logger.log(`NFT saved to DB for user ${sub}`);

          // Step 5: Send result to another queue
          // await this.rmqPublisherService.publishMintResult(nftData);
          this.logger.log(`Mint result sent to queue for user ${sub}`);
        } catch (err: any) {
          this.logger.error(
            `Error processing UID ${nft.uid}: ${err.reason || err.message}`,
          );
        }
      }

      channel.ack(message);
    } catch (err) {
      this.logger.error(`Unhandled error in handleNftMint: ${err.message}`);
    }
  }

  @MessagePattern()
  async handleUnknown(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    const exchange = message.fields?.exchange ?? 'N/A';
    const routingKey = message.fields?.routingKey ?? 'N/A';

    this.logger.warn('Received unknown message pattern');
    this.logger.debug(`Exchange: ${exchange}`);
    this.logger.debug(`Routing Key (Topic): ${routingKey}`);
    this.logger.debug(`Message data: ${JSON.stringify(data, null, 2)}`);

    channel.ack(message);
  }
}
