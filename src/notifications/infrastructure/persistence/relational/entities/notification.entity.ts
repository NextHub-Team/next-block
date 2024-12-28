import { DeviceEntity } from '../../../../../devices/infrastructure/persistence/relational/entities/device.entity';

import {
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	Column,
	ManyToOne,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
	name: 'notification',
})
export class NotificationEntity extends EntityRelationalHelper {
	@Column({
		nullable: true,
		type: String,
	})
	scheduledAt?: string | null;

	@Column({
		nullable: true,
		type: String,
	})
	sentAt?: string | null;

	@Column({
		nullable: true,
		type: Boolean,
	})
	isRead?: boolean | null;

	@Column({
		nullable: true,
		type: String,
	})
	status?: string | null;

	@Column({
		nullable: true,
		type: String,
	})
	priority?: string | null;

	@Column({
		nullable: false,
		type: String,
	})
	type: string;

	@ManyToOne(() => DeviceEntity, (parentEntity) => parentEntity.notifications, {
		eager: false,
		nullable: false,
	})
	device: DeviceEntity;

	@Column({
		nullable: false,
		type: String,
	})
	message: string;

	@Column({
		nullable: false,
		type: String,
	})
	title: string;

	@PrimaryGeneratedColumn('uuid')
	id: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
