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
import { OrderTransactionsService } from './order-transactions.service';
import { CreateOrderTransactionDto } from './dto/create-order-transaction.dto';
import { UpdateOrderTransactionDto } from './dto/update-order-transaction.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { OrderTransaction } from './domain/order-transaction';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllOrderTransactionsDto } from './dto/find-all-order-transactions.dto';

@ApiTags('Ordertransactions')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'order-transactions',
  version: '1',
})
export class OrderTransactionsController {
  constructor(
    private readonly orderTransactionsService: OrderTransactionsService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: OrderTransaction,
  })
  create(@Body() createOrderTransactionDto: CreateOrderTransactionDto) {
    return this.orderTransactionsService.create(createOrderTransactionDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(OrderTransaction),
  })
  async findAll(
    @Query() query: FindAllOrderTransactionsDto,
  ): Promise<InfinityPaginationResponseDto<OrderTransaction>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.orderTransactionsService.findAllWithPagination({
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
    type: OrderTransaction,
  })
  findById(@Param('id') id: string) {
    return this.orderTransactionsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: OrderTransaction,
  })
  update(
    @Param('id') id: string,
    @Body() updateOrderTransactionDto: UpdateOrderTransactionDto,
  ) {
    return this.orderTransactionsService.update(id, updateOrderTransactionDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.orderTransactionsService.remove(id);
  }
}
