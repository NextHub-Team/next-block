import { DevicesService } from '../devices/devices.service';
import { Device } from '../devices/domain/device';

import {
	forwardRef,
	HttpStatus,
	Inject,
	UnprocessableEntityException,
} from '@nestjs/common';

import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationRepository } from './infrastructure/persistence/notification.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Notification } from './domain/notification';

@Injectable()
export class NotificationsService {
	constructor(
		@Inject(forwardRef(() => DevicesService))
		private readonly deviceService: DevicesService,

		// Dependencies here
		private readonly notificationRepository: NotificationRepository,
	) {}

	async create(createNotificationDto: CreateNotificationDto) {
		// Do not remove comment below.
		// <creating-property />

		const deviceObject = await this.deviceService.findById(
			createNotificationDto.device.id,
		);
		if (!deviceObject) {
			throw new UnprocessableEntityException({
				status: HttpStatus.UNPROCESSABLE_ENTITY,
				errors: {
					device: 'notExists',
				},
			});
		}
		const device = deviceObject;

		return this.notificationRepository.create({
			// Do not remove comment below.
			// <creating-property-payload />
			scheduledAt: createNotificationDto.scheduledAt,

			sentAt: createNotificationDto.sentAt,

			isRead: createNotificationDto.isRead,

			status: createNotificationDto.status,

			priority: createNotificationDto.priority,

			type: createNotificationDto.type,

			device,

			message: createNotificationDto.message,

			title: createNotificationDto.title,
		});
	}

	findAllWithPagination({
		paginationOptions,
	}: {
		paginationOptions: IPaginationOptions;
	}) {
		return this.notificationRepository.findAllWithPagination({
			paginationOptions: {
				page: paginationOptions.page,
				limit: paginationOptions.limit,
			},
		});
	}

	findById(id: Notification['id']) {
		return this.notificationRepository.findById(id);
	}

	findByIds(ids: Notification['id'][]) {
		return this.notificationRepository.findByIds(ids);
	}

	async update(
		id: Notification['id'],

		updateNotificationDto: UpdateNotificationDto,
	) {
		// Do not remove comment below.
		// <updating-property />

		let device: Device | undefined = undefined;

		if (updateNotificationDto.device) {
			const deviceObject = await this.deviceService.findById(
				updateNotificationDto.device.id,
			);
			if (!deviceObject) {
				throw new UnprocessableEntityException({
					status: HttpStatus.UNPROCESSABLE_ENTITY,
					errors: {
						device: 'notExists',
					},
				});
			}
			device = deviceObject;
		}

		return this.notificationRepository.update(id, {
			// Do not remove comment below.
			// <updating-property-payload />
			scheduledAt: updateNotificationDto.scheduledAt,

			sentAt: updateNotificationDto.sentAt,

			isRead: updateNotificationDto.isRead,

			status: updateNotificationDto.status,

			priority: updateNotificationDto.priority,

			type: updateNotificationDto.type,

			device,

			message: updateNotificationDto.message,

			title: updateNotificationDto.title,
		});
	}

	remove(id: Notification['id']) {
		return this.notificationRepository.remove(id);
	}
}
