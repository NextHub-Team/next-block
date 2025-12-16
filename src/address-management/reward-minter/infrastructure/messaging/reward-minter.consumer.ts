import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RewardMintEventDto } from '../../dto/reward-mint-event.dto';
import { RewardMinterService } from '../../reward-minter.service';

@Controller()
export class RewardMinterConsumer {
  private readonly logger = new Logger(RewardMinterConsumer.name);

  constructor(private readonly rewardMinterService: RewardMinterService) {}

  @EventPattern('points.mint')
  async handle(@Payload() dto: RewardMintEventDto, @Ctx() ctx: RmqContext): Promise<void> {
    const channel = ctx.getChannelRef();
    const msg = ctx.getMessage();

    try {
      this.logger.log(`points.mint received sleeveIdRaw=${JSON.stringify(dto?.sleeveId)}`);
      await this.rewardMinterService.handleEvent(dto);
      channel.ack(msg);
    } catch (e: any) {
      this.logger.error(`points.mint failed: ${e?.message || e}`);
      channel.nack(msg, false, false);
    }
  }
}
