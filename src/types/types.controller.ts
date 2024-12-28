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
import { TypesService } from './types.service';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import {
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger';
import { Type } from './domain/type';
import { AuthGuard } from '@nestjs/passport';
import {
	InfinityPaginationResponse,
	InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllTypesDto } from './dto/find-all-types.dto';

@ApiTags('Types')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
	path: 'types',
	version: '1',
})
export class TypesController {
	constructor(private readonly typesService: TypesService) {}

	@Post()
	@ApiCreatedResponse({
		type: Type,
	})
	create(@Body() createTypeDto: CreateTypeDto) {
		return this.typesService.create(createTypeDto);
	}

	@Get()
	@ApiOkResponse({
		type: InfinityPaginationResponse(Type),
	})
	async findAll(
		@Query() query: FindAllTypesDto,
	): Promise<InfinityPaginationResponseDto<Type>> {
		const page = query?.page ?? 1;
		let limit = query?.limit ?? 10;
		if (limit > 50) {
			limit = 50;
		}

		return infinityPagination(
			await this.typesService.findAllWithPagination({
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
		type: Type,
	})
	findById(@Param('id') id: string) {
		return this.typesService.findById(id);
	}

	@Patch(':id')
	@ApiParam({
		name: 'id',
		type: String,
		required: true,
	})
	@ApiOkResponse({
		type: Type,
	})
	update(@Param('id') id: string, @Body() updateTypeDto: UpdateTypeDto) {
		return this.typesService.update(id, updateTypeDto);
	}

	@Delete(':id')
	@ApiParam({
		name: 'id',
		type: String,
		required: true,
	})
	remove(@Param('id') id: string) {
		return this.typesService.remove(id);
	}
}
