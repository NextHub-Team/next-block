import { Injectable } from '@nestjs/common';
import { ZeroXClient } from './zerox.client';
import { ExecuteSwapDto } from '../../dto/execute.dto';

@Injectable()
export class ZeroXService {
  constructor(private readonly client: ZeroXClient) {}

  getPermit2Price(params: any) {
    return this.client.getPermit2Price(params);
  }

  getPermit2Quote(params: any) {
    return this.client.getPermit2Quote(params);
  }

  getAllowanceHolderPrice(params: any) {
    return this.client.getAllowanceHolderPrice(params);
  }

  getAllowanceHolderQuote(params: any) {
    return this.client.getAllowanceHolderQuote(params);
  }

  getChains() {
    return this.client.getChains();
  }

  executeSwap(body: ExecuteSwapDto) {
    // TODO: Fireblocks logic must impemented here
    return {
      message: 'Swap execution simulation (Fireblocks integration pending)',
      data: {
        zid: body.zid,
        chainId: body.chainId,
        transaction: body.transaction,
      },
    };
  }
}
