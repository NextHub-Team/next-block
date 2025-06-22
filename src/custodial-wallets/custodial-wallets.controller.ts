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
import { CustodialWalletsService } from './custodial-wallets.service';
import { CreateCustodialWalletDto } from './dto/create-custodial-wallet.dto';
import { UpdateCustodialWalletDto } from './dto/update-custodial-wallet.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CustodialWallet } from './domain/custodial-wallet';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllCustodialWalletsDto } from './dto/find-all-custodial-wallets.dto';

@ApiTags('Custodialwallets')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'custodial-wallets',
  version: '1',
})
export class CustodialWalletsController {
  constructor(
    private readonly custodialWalletsService: CustodialWalletsService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: CustodialWallet,
  })
  create(@Body() createCustodialWalletDto: CreateCustodialWalletDto) {
    return this.custodialWalletsService.create(createCustodialWalletDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(CustodialWallet),
  })
  async findAll(
    @Query() query: FindAllCustodialWalletsDto,
  ): Promise<InfinityPaginationResponseDto<CustodialWallet>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.custodialWalletsService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

@Get('by-name')
@ApiOkResponse({ type: CustodialWallet })
getVaultByName(@Query('name') name: string) {
  return this.custodialWalletsService.getVaultByName(name);
}


@Get('by-names')
@ApiOkResponse({ isArray: true })
getVaultsByNames(@Query('names') names: string) {
  const nameList = names.split(',');
  return this.custodialWalletsService.getVaultsByNames(nameList);
}

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: CustodialWallet,
  })
  findById(@Param('id') id: string) {
    return this.custodialWalletsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: CustodialWallet,
  })
  update(
    @Param('id') id: string,
    @Body() updateCustodialWalletDto: UpdateCustodialWalletDto,
  ) {
    return this.custodialWalletsService.update(id, updateCustodialWalletDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.custodialWalletsService.remove(id);
  }



}
