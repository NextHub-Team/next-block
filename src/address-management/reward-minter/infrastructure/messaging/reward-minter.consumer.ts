import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RewardMintEventDto } from '../../dto/reward-mint-event.dto';
import { RewardMinterService } from '../../reward-minter.service';

@Controller()
export class RewardMinterConsumer {
  private readonly logger = new Logger(RewardMinterConsumer.name);

  constructor(private readonly rewardMinterService: RewardMinterService) {}

  @EventPattern('points.mint')
  async handleRewardMint(
    @Payload() data: RewardMintEventDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      if (!data?.userId) throw new Error('Payload.userId is required');

      this.logger.log('Received points.mint event');
      this.logger.debug(`Payload: ${JSON.stringify(data, null, 2)}`);

      const address = await this.rewardMinterService.resolveOrCreateWalletAddress(data);

      this.logger.log(`Deposit address for userId=${data.userId}: ${address}`);

      channel.ack(message);
    } catch (err: any) {
      this.logger.error(`Error while processing points.mint: ${err?.message || err}`);
      channel.ack(message);
    }
  }
}
