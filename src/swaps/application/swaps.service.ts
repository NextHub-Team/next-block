import { Injectable } from '@nestjs/common';
import { ZeroXService } from '../infrastructure/zerox/zerox.service';
import { ExecuteSwapDto } from '../dto/execute.dto';

@Injectable()
export class SwapsService {
  constructor(private readonly zerox: ZeroXService) {}

  getPermit2Price(params: any) {
    return this.zerox.getPermit2Price(params);
  }

  getPermit2Quote(params: any) {
    return this.zerox.getPermit2Quote(params);
  }

  getAllowanceHolderPrice(params: any) {
    return this.zerox.getAllowanceHolderPrice(params);
  }

  getAllowanceHolderQuote(params: any) {
    return this.zerox.getAllowanceHolderQuote(params);
  }

  getChains() {
    return this.zerox.getChains();
  }

  executeSwap(body: ExecuteSwapDto) {
  return this.zerox.executeSwap(body);
}
}
