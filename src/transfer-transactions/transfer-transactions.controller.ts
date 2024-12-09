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
import { TransferTransactionsService } from './transfer-transactions.service';
import { CreateTransferTransactionDto } from './dto/create-transfer-transaction.dto';
import { UpdateTransferTransactionDto } from './dto/update-transfer-transaction.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { TransferTransaction } from './domain/transfer-transaction';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllTransferTransactionsDto } from './dto/find-all-transfer-transactions.dto';

@ApiTags('Transfertransactions')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'transfer-transactions',
  version: '1',
})
export class TransferTransactionsController {
  constructor(
    private readonly transferTransactionsService: TransferTransactionsService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: TransferTransaction,
  })
  create(@Body() createTransferTransactionDto: CreateTransferTransactionDto) {
    return this.transferTransactionsService.create(
      createTransferTransactionDto,
    );
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(TransferTransaction),
  })
  async findAll(
    @Query() query: FindAllTransferTransactionsDto,
  ): Promise<InfinityPaginationResponseDto<TransferTransaction>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.transferTransactionsService.findAllWithPagination({
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
    type: TransferTransaction,
  })
  findById(@Param('id') id: string) {
    return this.transferTransactionsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: TransferTransaction,
  })
  update(
    @Param('id') id: string,
    @Body() updateTransferTransactionDto: UpdateTransferTransactionDto,
  ) {
    return this.transferTransactionsService.update(
      id,
      updateTransferTransactionDto,
    );
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.transferTransactionsService.remove(id);
  }
}
