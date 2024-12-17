import { Controller, Get, Query } from '@nestjs/common';
import { ZeroxService } from './zerox.service';
// import { FireblocksService } from '../../fireblocks/fireblocks.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Swap')
@Controller({
  path: 'swap',
  version: '1',
})
export class SwapController {
  constructor(
    private readonly zeroxService: ZeroxService,
    // private readonly fireblocksService: FireblocksService,
  ) {}

  @Get('quote')
  async getQuote(
    @Query('sellToken') sellToken: string,
    @Query('buyToken') buyToken: string,
    @Query('sellAmount') sellAmount: string,
    @Query('takerAddress') takerAddress?: string,
  ) {
    return this.zeroxService.getQuote(
      sellToken,
      buyToken,
      sellAmount,
      takerAddress,
    );
  }

  @Get('price')
  async getPrice(
    @Query('sellToken') sellToken: string,
    @Query('buyToken') buyToken: string,
    @Query('sellAmount') sellAmount: string,
  ) {
    return this.zeroxService.getPrice(sellToken, buyToken, sellAmount);
  }

  //     @Post('send-transaction')
  //     async sendTransaction(@Body() body: any) {
  //         const { assetId, amount, srcId, destId } = body;
  //         return this.fireblocksService.createTransaction(assetId, amount, srcId, destId);
  //     }
}
