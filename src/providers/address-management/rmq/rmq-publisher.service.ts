import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RmqPublisherService {
  constructor(
    @Inject('SLEEVES_PUBLISHER') private readonly client: ClientProxy,
  ) {}

  async publishMintResult(payload: any) {
    await this.client.emit('drop.response', payload);
  }
}
