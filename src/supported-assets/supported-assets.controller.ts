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
import { SupportedAssetsService } from './supported-assets.service';
import { CreateSupportedAssetDto } from './dto/create-supported-asset.dto';
import { UpdateSupportedAssetDto } from './dto/update-supported-asset.dto';
import {
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger';
import { SupportedAsset } from './domain/supported-asset';
import { AuthGuard } from '@nestjs/passport';
import {
	InfinityPaginationResponse,
	InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllSupportedAssetsDto } from './dto/find-all-supported-assets.dto';

@ApiTags('SupportedAssets')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
	path: 'supported-assets',
	version: '1',
})
export class SupportedAssetsController {
	constructor(
		private readonly supportedAssetsService: SupportedAssetsService,
	) {}

	@Post()
	@ApiCreatedResponse({
		type: SupportedAsset,
	})
	create(@Body() createSupportedAssetDto: CreateSupportedAssetDto) {
		return this.supportedAssetsService.create(createSupportedAssetDto);
	}

	@Get()
	@ApiOkResponse({
		type: InfinityPaginationResponse(SupportedAsset),
	})
	async findAll(
		@Query() query: FindAllSupportedAssetsDto,
	): Promise<InfinityPaginationResponseDto<SupportedAsset>> {
		const page = query?.page ?? 1;
		let limit = query?.limit ?? 10;
		if (limit > 50) {
			limit = 50;
		}

		return infinityPagination(
			await this.supportedAssetsService.findAllWithPagination({
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
		type: SupportedAsset,
	})
	findById(@Param('id') id: string) {
		return this.supportedAssetsService.findById(id);
	}

	@Patch(':id')
	@ApiParam({
		name: 'id',
		type: String,
		required: true,
	})
	@ApiOkResponse({
		type: SupportedAsset,
	})
	update(
		@Param('id') id: string,
		@Body() updateSupportedAssetDto: UpdateSupportedAssetDto,
	) {
		return this.supportedAssetsService.update(id, updateSupportedAssetDto);
	}

	@Delete(':id')
	@ApiParam({
		name: 'id',
		type: String,
		required: true,
	})
	remove(@Param('id') id: string) {
		return this.supportedAssetsService.remove(id);
	}
}
