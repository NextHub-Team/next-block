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
import { MainWalletsService } from './main-wallets.service';
import { CreateMainWalletDto } from './dto/create-main-wallet.dto';
import { UpdateMainWalletDto } from './dto/update-main-wallet.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { MainWallet } from './domain/main-wallet';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllMainWalletsDto } from './dto/find-all-main-wallets.dto';

@ApiTags('Mainwallets')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'main-wallets',
  version: '1',
})
export class MainWalletsController {
  constructor(private readonly mainWalletsService: MainWalletsService) {}

  @Post()
  @ApiCreatedResponse({
    type: MainWallet,
  })
  create(@Body() createMainWalletDto: CreateMainWalletDto) {
    return this.mainWalletsService.create(createMainWalletDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(MainWallet),
  })
  async findAll(
    @Query() query: FindAllMainWalletsDto,
  ): Promise<InfinityPaginationResponseDto<MainWallet>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.mainWalletsService.findAllWithPagination({
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
    type: MainWallet,
  })
  findById(@Param('id') id: string) {
    return this.mainWalletsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: MainWallet,
  })
  update(
    @Param('id') id: string,
    @Body() updateMainWalletDto: UpdateMainWalletDto,
  ) {
    return this.mainWalletsService.update(id, updateMainWalletDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.mainWalletsService.remove(id);
  }
}
