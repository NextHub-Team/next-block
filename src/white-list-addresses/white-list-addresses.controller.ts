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
import { WhiteListAddressesService } from './white-list-addresses.service';
import { CreateWhiteListAddressDto } from './dto/create-white-list-address.dto';
import { UpdateWhiteListAddressDto } from './dto/update-white-list-address.dto';
import {
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger';
import { WhiteListAddress } from './domain/white-list-address';
import { AuthGuard } from '@nestjs/passport';
import {
	InfinityPaginationResponse,
	InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllWhiteListAddressesDto } from './dto/find-all-white-list-addresses.dto';

@ApiTags('WhiteListAddresses')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
	path: 'white-list-addresses',
	version: '1',
})
export class WhiteListAddressesController {
	constructor(
		private readonly whiteListAddressesService: WhiteListAddressesService,
	) {}

	@Post()
	@ApiCreatedResponse({
		type: WhiteListAddress,
	})
	create(@Body() createWhiteListAddressDto: CreateWhiteListAddressDto) {
		return this.whiteListAddressesService.create(createWhiteListAddressDto);
	}

	@Get()
	@ApiOkResponse({
		type: InfinityPaginationResponse(WhiteListAddress),
	})
	async findAll(
		@Query() query: FindAllWhiteListAddressesDto,
	): Promise<InfinityPaginationResponseDto<WhiteListAddress>> {
		const page = query?.page ?? 1;
		let limit = query?.limit ?? 10;
		if (limit > 50) {
			limit = 50;
		}

		return infinityPagination(
			await this.whiteListAddressesService.findAllWithPagination({
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
		type: WhiteListAddress,
	})
	findById(@Param('id') id: string) {
		return this.whiteListAddressesService.findById(id);
	}

	@Patch(':id')
	@ApiParam({
		name: 'id',
		type: String,
		required: true,
	})
	@ApiOkResponse({
		type: WhiteListAddress,
	})
	update(
		@Param('id') id: string,
		@Body() updateWhiteListAddressDto: UpdateWhiteListAddressDto,
	) {
		return this.whiteListAddressesService.update(id, updateWhiteListAddressDto);
	}

	@Delete(':id')
	@ApiParam({
		name: 'id',
		type: String,
		required: true,
	})
	remove(@Param('id') id: string) {
		return this.whiteListAddressesService.remove(id);
	}
}
