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
import { AccessControlsService } from './access-controls.service';
import { CreateAccessControlDto } from './dto/create-access-control.dto';
import { UpdateAccessControlDto } from './dto/update-access-control.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AccessControl } from './domain/access-control';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllAccessControlsDto } from './dto/find-all-access-controls.dto';

@ApiTags('Accesscontrols')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'access-controls',
  version: '1',
})
export class AccessControlsController {
  constructor(private readonly accessControlsService: AccessControlsService) {}

  @Post()
  @ApiCreatedResponse({
    type: AccessControl,
  })
  create(@Body() createAccessControlDto: CreateAccessControlDto) {
    return this.accessControlsService.create(createAccessControlDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(AccessControl),
  })
  async findAll(
    @Query() query: FindAllAccessControlsDto,
  ): Promise<InfinityPaginationResponseDto<AccessControl>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.accessControlsService.findAllWithPagination({
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
    type: AccessControl,
  })
  findById(@Param('id') id: string) {
    return this.accessControlsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: AccessControl,
  })
  update(
    @Param('id') id: string,
    @Body() updateAccessControlDto: UpdateAccessControlDto,
  ) {
    return this.accessControlsService.update(id, updateAccessControlDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.accessControlsService.remove(id);
  }
}
