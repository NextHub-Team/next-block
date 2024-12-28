import { UserLogsService } from '../user-logs/user-logs.service';
import { UserLog } from '../user-logs/domain/user-log';

import { HttpStatus, UnprocessableEntityException } from '@nestjs/common';

import { Injectable } from '@nestjs/common';
import { CreateEventLogDto } from './dto/create-event-log.dto';
import { UpdateEventLogDto } from './dto/update-event-log.dto';
import { EventLogRepository } from './infrastructure/persistence/event-log.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { EventLog } from './domain/event-log';

@Injectable()
export class EventLogsService {
	constructor(
		private readonly userLogService: UserLogsService,

		// Dependencies here
		private readonly eventLogRepository: EventLogRepository,
	) {}

	async create(createEventLogDto: CreateEventLogDto) {
		// Do not remove comment below.
		// <creating-property />

		const userLogObject = await this.userLogService.findById(
			createEventLogDto.userLog.id,
		);
		if (!userLogObject) {
			throw new UnprocessableEntityException({
				status: HttpStatus.UNPROCESSABLE_ENTITY,
				errors: {
					userLog: 'notExists',
				},
			});
		}
		const userLog = userLogObject;

		return this.eventLogRepository.create({
			// Do not remove comment below.
			// <creating-property-payload />
			status: createEventLogDto.status,

			processed: createEventLogDto.processed,

			newValue: createEventLogDto.newValue,

			oldValue: createEventLogDto.oldValue,

			property: createEventLogDto.property,

			entity: createEventLogDto.entity,

			userLog,
		});
	}

	findAllWithPagination({
		paginationOptions,
	}: {
		paginationOptions: IPaginationOptions;
	}) {
		return this.eventLogRepository.findAllWithPagination({
			paginationOptions: {
				page: paginationOptions.page,
				limit: paginationOptions.limit,
			},
		});
	}

	findById(id: EventLog['id']) {
		return this.eventLogRepository.findById(id);
	}

	findByIds(ids: EventLog['id'][]) {
		return this.eventLogRepository.findByIds(ids);
	}

	async update(
		id: EventLog['id'],

		updateEventLogDto: UpdateEventLogDto,
	) {
		// Do not remove comment below.
		// <updating-property />

		let userLog: UserLog | undefined = undefined;

		if (updateEventLogDto.userLog) {
			const userLogObject = await this.userLogService.findById(
				updateEventLogDto.userLog.id,
			);
			if (!userLogObject) {
				throw new UnprocessableEntityException({
					status: HttpStatus.UNPROCESSABLE_ENTITY,
					errors: {
						userLog: 'notExists',
					},
				});
			}
			userLog = userLogObject;
		}

		return this.eventLogRepository.update(id, {
			// Do not remove comment below.
			// <updating-property-payload />
			status: updateEventLogDto.status,

			processed: updateEventLogDto.processed,

			newValue: updateEventLogDto.newValue,

			oldValue: updateEventLogDto.oldValue,

			property: updateEventLogDto.property,

			entity: updateEventLogDto.entity,

			userLog,
		});
	}

	remove(id: EventLog['id']) {
		return this.eventLogRepository.remove(id);
	}
}
