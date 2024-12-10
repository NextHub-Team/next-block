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
import { NftTransactionsService } from './nft-transactions.service';
import { CreateNftTransactionDto } from './dto/create-nft-transaction.dto';
import { UpdateNftTransactionDto } from './dto/update-nft-transaction.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { NftTransaction } from './domain/nft-transaction';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllNftTransactionsDto } from './dto/find-all-nft-transactions.dto';

@ApiTags('NftTransactions')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'nft-transactions',
  version: '1',
})
export class NftTransactionsController {
  constructor(
    private readonly nftTransactionsService: NftTransactionsService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: NftTransaction,
  })
  create(@Body() createNftTransactionDto: CreateNftTransactionDto) {
    return this.nftTransactionsService.create(createNftTransactionDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(NftTransaction),
  })
  async findAll(
    @Query() query: FindAllNftTransactionsDto,
  ): Promise<InfinityPaginationResponseDto<NftTransaction>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.nftTransactionsService.findAllWithPagination({
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
    type: NftTransaction,
  })
  findById(@Param('id') id: string) {
    return this.nftTransactionsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: NftTransaction,
  })
  update(
    @Param('id') id: string,
    @Body() updateNftTransactionDto: UpdateNftTransactionDto,
  ) {
    return this.nftTransactionsService.update(id, updateNftTransactionDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.nftTransactionsService.remove(id);
  }
}
