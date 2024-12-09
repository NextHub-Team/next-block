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
import { NFTsService } from './nfts.service';
import { CreateNFTDto } from './dto/create-nft.dto';
import { UpdateNFTDto } from './dto/update-nft.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { NFT } from './domain/nft';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllNFTsDto } from './dto/find-all-nfs.dto';

@ApiTags('Nfts')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'nfts',
  version: '1',
})
export class NFTsController {
  constructor(private readonly nFTsService: NFTsService) {}

  @Post()
  @ApiCreatedResponse({
    type: NFT,
  })
  create(@Body() createNFTDto: CreateNFTDto) {
    return this.nFTsService.create(createNFTDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(NFT),
  })
  async findAll(
    @Query() query: FindAllNFTsDto,
  ): Promise<InfinityPaginationResponseDto<NFT>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.nFTsService.findAllWithPagination({
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
    type: NFT,
  })
  findById(@Param('id') id: string) {
    return this.nFTsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: NFT,
  })
  update(@Param('id') id: string, @Body() updateNFTDto: UpdateNFTDto) {
    return this.nFTsService.update(id, updateNFTDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.nFTsService.remove(id);
  }
}
