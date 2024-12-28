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
import { StatusesService } from './statuses.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import {
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger';
import { Status } from './domain/status';
import { AuthGuard } from '@nestjs/passport';
import {
	InfinityPaginationResponse,
	InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllStatusesDto } from './dto/find-all-statuses.dto';

@ApiTags('Statuses')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
	path: 'statuses',
	version: '1',
})
export class StatusesController {
	constructor(private readonly statusesService: StatusesService) {}

	@Post()
	@ApiCreatedResponse({
		type: Status,
	})
	create(@Body() createStatusDto: CreateStatusDto) {
		return this.statusesService.create(createStatusDto);
	}

	@Get()
	@ApiOkResponse({
		type: InfinityPaginationResponse(Status),
	})
	async findAll(
		@Query() query: FindAllStatusesDto,
	): Promise<InfinityPaginationResponseDto<Status>> {
		const page = query?.page ?? 1;
		let limit = query?.limit ?? 10;
		if (limit > 50) {
			limit = 50;
		}

		return infinityPagination(
			await this.statusesService.findAllWithPagination({
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
		type: Status,
	})
	findById(@Param('id') id: string) {
		return this.statusesService.findById(id);
	}

	@Patch(':id')
	@ApiParam({
		name: 'id',
		type: String,
		required: true,
	})
	@ApiOkResponse({
		type: Status,
	})
	update(@Param('id') id: string, @Body() updateStatusDto: UpdateStatusDto) {
		return this.statusesService.update(id, updateStatusDto);
	}

	@Delete(':id')
	@ApiParam({
		name: 'id',
		type: String,
		required: true,
	})
	remove(@Param('id') id: string) {
		return this.statusesService.remove(id);
	}
}
