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
import { SleevesService } from './sleeves.service';
import { CreateSleevesDto } from './dto/create-sleeves.dto';
import { UpdateSleevesDto } from './dto/update-sleeves.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Sleeves } from './domain/sleeves';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllSleevesDto } from './dto/find-all-sleeves.dto';
import { DisabledEndpoint } from '../utils/decorators/disabled-endpoint.decorator';

@ApiTags('Sleeves')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'sleeves',
  version: '1',
})
export class SleevesController {
  constructor(private readonly sleevesService: SleevesService) {}

  @Post()
  @ApiCreatedResponse({
    type: Sleeves,
  })
  @DisabledEndpoint({ markDeprecated: true })
  create(@Body() createSleevesDto: CreateSleevesDto) {
    return this.sleevesService.create(createSleevesDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Sleeves),
  })
  async findAll(
    @Query() query: FindAllSleevesDto,
  ): Promise<InfinityPaginationResponseDto<Sleeves>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.sleevesService.findAllWithPagination({
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
    type: Sleeves,
  })
  findById(@Param('id') id: string) {
    return this.sleevesService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Sleeves,
  })
  @DisabledEndpoint({ markDeprecated: true })
  update(@Param('id') id: string, @Body() updateSleevesDto: UpdateSleevesDto) {
    return this.sleevesService.update(id, updateSleevesDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.sleevesService.remove(id);
  }
}
