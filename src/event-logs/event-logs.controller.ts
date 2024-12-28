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
import { EventLogsService } from './event-logs.service';
import { CreateEventLogDto } from './dto/create-event-log.dto';
import { UpdateEventLogDto } from './dto/update-event-log.dto';
import {
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger';
import { EventLog } from './domain/event-log';
import { AuthGuard } from '@nestjs/passport';
import {
	InfinityPaginationResponse,
	InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllEventLogsDto } from './dto/find-all-event-logs.dto';

@ApiTags('EventLogs')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
	path: 'event-logs',
	version: '1',
})
export class EventLogsController {
	constructor(private readonly eventLogsService: EventLogsService) {}

	@Post()
	@ApiCreatedResponse({
		type: EventLog,
	})
	create(@Body() createEventLogDto: CreateEventLogDto) {
		return this.eventLogsService.create(createEventLogDto);
	}

	@Get()
	@ApiOkResponse({
		type: InfinityPaginationResponse(EventLog),
	})
	async findAll(
		@Query() query: FindAllEventLogsDto,
	): Promise<InfinityPaginationResponseDto<EventLog>> {
		const page = query?.page ?? 1;
		let limit = query?.limit ?? 10;
		if (limit > 50) {
			limit = 50;
		}

		return infinityPagination(
			await this.eventLogsService.findAllWithPagination({
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
		type: EventLog,
	})
	findById(@Param('id') id: string) {
		return this.eventLogsService.findById(id);
	}

	@Patch(':id')
	@ApiParam({
		name: 'id',
		type: String,
		required: true,
	})
	@ApiOkResponse({
		type: EventLog,
	})
	update(
		@Param('id') id: string,
		@Body() updateEventLogDto: UpdateEventLogDto,
	) {
		return this.eventLogsService.update(id, updateEventLogDto);
	}

	@Delete(':id')
	@ApiParam({
		name: 'id',
		type: String,
		required: true,
	})
	remove(@Param('id') id: string) {
		return this.eventLogsService.remove(id);
	}
}
