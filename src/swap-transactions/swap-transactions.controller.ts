import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SwapTransactionsService } from './swap-transactions.service';
import { CreateSwapTransactionDto } from './dto/create-swap-transaction.dto';
import { UpdateSwapTransactionDto } from './dto/update-swap-transaction.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { SwapTransaction } from './domain/swap-transaction';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllSwapTransactionsDto } from './dto/find-all-swap-transactions.dto';

@ApiTags('Swaptransactions')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'swap-transactions',
  version: '1',
})
export class SwapTransactionsController {
  constructor(
    private readonly swapTransactionsService: SwapTransactionsService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: SwapTransaction,
  })
  create(@Body() createSwapTransactionDto: CreateSwapTransactionDto) {
    return this.swapTransactionsService.create(createSwapTransactionDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(SwapTransaction),
  })
  async findAll(
    @Query() query: FindAllSwapTransactionsDto,
  ): Promise<InfinityPaginationResponseDto<SwapTransaction>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.swapTransactionsService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: SwapTransaction,
  })
  findById(@Param('id') id: string) {
    return this.swapTransactionsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: SwapTransaction,
  })
  update(
    @Param('id') id: string,
    @Body() updateSwapTransactionDto: UpdateSwapTransactionDto,
  ) {
    return this.swapTransactionsService.update(id, updateSwapTransactionDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.swapTransactionsService.remove(id);
  }
}
