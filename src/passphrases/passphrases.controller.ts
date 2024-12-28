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
import { PassphrasesService } from './passphrases.service';
import { CreatePassphraseDto } from './dto/create-passphrase.dto';
import { UpdatePassphraseDto } from './dto/update-passphrase.dto';
import {
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger';
import { Passphrase } from './domain/passphrase';
import { AuthGuard } from '@nestjs/passport';
import {
	InfinityPaginationResponse,
	InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllPassphrasesDto } from './dto/find-all-passphrases.dto';

@ApiTags('Passphrases')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
	path: 'passphrases',
	version: '1',
})
export class PassphrasesController {
	constructor(private readonly passphrasesService: PassphrasesService) {}

	@Post()
	@ApiCreatedResponse({
		type: Passphrase,
	})
	create(@Body() createPassphraseDto: CreatePassphraseDto) {
		return this.passphrasesService.create(createPassphraseDto);
	}

	@Get()
	@ApiOkResponse({
		type: InfinityPaginationResponse(Passphrase),
	})
	async findAll(
		@Query() query: FindAllPassphrasesDto,
	): Promise<InfinityPaginationResponseDto<Passphrase>> {
		const page = query?.page ?? 1;
		let limit = query?.limit ?? 10;
		if (limit > 50) {
			limit = 50;
		}

		return infinityPagination(
			await this.passphrasesService.findAllWithPagination({
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
		type: Passphrase,
	})
	findById(@Param('id') id: string) {
		return this.passphrasesService.findById(id);
	}

	@Patch(':id')
	@ApiParam({
		name: 'id',
		type: String,
		required: true,
	})
	@ApiOkResponse({
		type: Passphrase,
	})
	update(
		@Param('id') id: string,
		@Body() updatePassphraseDto: UpdatePassphraseDto,
	) {
		return this.passphrasesService.update(id, updatePassphraseDto);
	}

	@Delete(':id')
	@ApiParam({
		name: 'id',
		type: String,
		required: true,
	})
	remove(@Param('id') id: string) {
		return this.passphrasesService.remove(id);
	}
}
