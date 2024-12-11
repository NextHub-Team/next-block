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
import { TransactionLogsService } from './transaction-logs.service';
import { CreateTransactionLogDto } from './dto/create-transaction-log.dto';
import { UpdateTransactionLogDto } from './dto/update-transaction-log.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { TransactionLog } from './domain/transaction-log';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllTransactionLogsDto } from './dto/find-all-transaction-logs.dto';

@ApiTags('TransactionLogs')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'transaction-logs',
  version: '1',
})
export class TransactionLogsController {
  constructor(
    private readonly transactionLogsService: TransactionLogsService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: TransactionLog,
  })
  create(@Body() createTransactionLogDto: CreateTransactionLogDto) {
    return this.transactionLogsService.create(createTransactionLogDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(TransactionLog),
  })
  async findAll(
    @Query() query: FindAllTransactionLogsDto,
  ): Promise<InfinityPaginationResponseDto<TransactionLog>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.transactionLogsService.findAllWithPagination({
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
    type: TransactionLog,
  })
  findById(@Param('id') id: string) {
    return this.transactionLogsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: TransactionLog,
  })
  update(
    @Param('id') id: string,
    @Body() updateTransactionLogDto: UpdateTransactionLogDto,
  ) {
    return this.transactionLogsService.update(id, updateTransactionLogDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.transactionLogsService.remove(id);
  }
}
