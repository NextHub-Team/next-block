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
import { NftsService } from './nfts.service';
import { CreateNftDto } from './dto/create-nft.dto';
import { UpdateNftDto } from './dto/update-nft.dto';
import {
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger';
import { Nft } from './domain/nft';
import { AuthGuard } from '@nestjs/passport';
import {
	InfinityPaginationResponse,
	InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllNftsDto } from './dto/find-all-nfts.dto';

@ApiTags('Nfts')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
	path: 'nfts',
	version: '1',
})
export class NftsController {
	constructor(private readonly nftsService: NftsService) {}

	@Post()
	@ApiCreatedResponse({
		type: Nft,
	})
	create(@Body() createNftDto: CreateNftDto) {
		return this.nftsService.create(createNftDto);
	}

	@Get()
	@ApiOkResponse({
		type: InfinityPaginationResponse(Nft),
	})
	async findAll(
		@Query() query: FindAllNftsDto,
	): Promise<InfinityPaginationResponseDto<Nft>> {
		const page = query?.page ?? 1;
		let limit = query?.limit ?? 10;
		if (limit > 50) {
			limit = 50;
		}

		return infinityPagination(
			await this.nftsService.findAllWithPagination({
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
		type: Nft,
	})
	findById(@Param('id') id: string) {
		return this.nftsService.findById(id);
	}

	@Patch(':id')
	@ApiParam({
		name: 'id',
		type: String,
		required: true,
	})
	@ApiOkResponse({
		type: Nft,
	})
	update(@Param('id') id: string, @Body() updateNftDto: UpdateNftDto) {
		return this.nftsService.update(id, updateNftDto);
	}

	@Delete(':id')
	@ApiParam({
		name: 'id',
		type: String,
		required: true,
	})
	remove(@Param('id') id: string) {
		return this.nftsService.remove(id);
	}
}
