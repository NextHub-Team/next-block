import { Controller, Get, Query,Body, Post  } from '@nestjs/common';
import { SwapsService } from '../application/swaps.service';
import { SwapPriceDto } from '../dto/price.dto';
import { SwapQuoteDto } from '../dto/quote.dto';
import { ExecuteSwapDto } from '../dto/execute.dto';

@Controller('swaps/zerox')
export class SwapsController {
  constructor(private readonly service: SwapsService) {}

  @Get('permit2/price')
  getPermit2Price(@Query() query: SwapPriceDto) {
    return this.service.getPermit2Price(query);
  }

  @Get('permit2/quote')
  getPermit2Quote(@Query() query: SwapQuoteDto) {
    return this.service.getPermit2Quote(query);
  }

  @Get('allowance-holder/price')
  getAllowanceHolderPrice(@Query() query: SwapPriceDto) {
    return this.service.getAllowanceHolderPrice(query);
  }

  @Get('allowance-holder/quote')
  getAllowanceHolderQuote(@Query() query: SwapQuoteDto) {
    return this.service.getAllowanceHolderQuote(query);
  }

  @Get('chains')
  getChains() {
    return this.service.getChains();
  }

@Post('execute')
executeSwap(@Body() body: ExecuteSwapDto) {
  return this.service.executeSwap(body);
}
}
