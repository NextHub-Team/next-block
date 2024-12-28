import { UsersService } from '../users/users.service';
import {
	forwardRef,
	HttpStatus,
	Inject,
	UnprocessableEntityException,
} from '@nestjs/common';

import { Injectable } from '@nestjs/common';
import { CreateUserLogDto } from './dto/create-user-log.dto';
import { UpdateUserLogDto } from './dto/update-user-log.dto';
import { UserLogRepository } from './infrastructure/persistence/user-log.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { UserLog } from './domain/user-log';
import { User } from '../users/domain/user';

@Injectable()
export class UserLogsService {
	constructor(
		@Inject(forwardRef(() => UsersService))
		private readonly userService: UsersService,

		// Dependencies here
		private readonly userLogRepository: UserLogRepository,
	) {}

	async create(createUserLogDto: CreateUserLogDto) {
		// Do not remove comment below.
		// <creating-property />

		const userObject = await this.userService.findById(
			createUserLogDto.user.id,
		);
		if (!userObject) {
			throw new UnprocessableEntityException({
				status: HttpStatus.UNPROCESSABLE_ENTITY,
				errors: {
					user: 'notExists',
				},
			});
		}
		const user = userObject;

		return this.userLogRepository.create({
			// Do not remove comment below.
			// <creating-property-payload />
			event: createUserLogDto.event,
			details: createUserLogDto.details,
			user,
		});
	}

	findAllWithPagination({
		paginationOptions,
	}: {
		paginationOptions: IPaginationOptions;
	}) {
		return this.userLogRepository.findAllWithPagination({
			paginationOptions: {
				page: paginationOptions.page,
				limit: paginationOptions.limit,
			},
		});
	}

	findById(id: UserLog['id']) {
		return this.userLogRepository.findById(id);
	}

	findByIds(ids: UserLog['id'][]) {
		return this.userLogRepository.findByIds(ids);
	}

	async update(
		id: UserLog['id'],

		updateUserLogDto: UpdateUserLogDto,
	) {
		// Do not remove comment below.
		// <updating-property />

		let user: User | undefined = undefined;

		if (updateUserLogDto.user) {
			const userObject = await this.userService.findById(
				updateUserLogDto.user.id,
			);
			if (!userObject) {
				throw new UnprocessableEntityException({
					status: HttpStatus.UNPROCESSABLE_ENTITY,
					errors: {
						user: 'notExists',
					},
				});
			}
			user = userObject;
		}

		return this.userLogRepository.update(id, {
			// Do not remove comment below.
			// <updating-property-payload />

			event: updateUserLogDto.event,

			details: updateUserLogDto.details,

			user,
		});
	}

	remove(id: UserLog['id']) {
		return this.userLogRepository.remove(id);
	}
}
