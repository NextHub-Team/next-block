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
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { CustodialWalletsService } from './custodial-wallets.service';
import { CreateCustodialWalletDto } from './dto/create-custodial-wallet.dto';
import { UpdateCustodialWalletDto } from './dto/update-custodial-wallet.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
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
import { CreateCustodialWalletUserDto } from './dto/create-custodial-wallet-user.dto';

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

  @Get('addresses')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Addresses by Vault IDs' })
  async getAddressesByVaultIds(@Query('vaultIds') vaultIds: string) {
    const ids = vaultIds.split(',').map((id) => id.trim());
    return this.custodialWalletsService.getAddressesByVaultIds(ids);
  }

  @Post('me')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: CustodialWallet })
  async createByUser(
    @Request() request,
    @Body() dto: CreateCustodialWalletUserDto,
  ) {
    return this.custodialWalletsService.createByUser(dto, request.user);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: CustodialWallet,
    isArray: true,
    description: 'Returns custodial wallets for current user',
  })
  @ApiNotFoundResponse({
    description: 'No custodial wallets found for this user',
  })
  async findAllByMe(@Request() request): Promise<CustodialWallet[]> {
    return this.custodialWalletsService.findByMe(request.user);
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
