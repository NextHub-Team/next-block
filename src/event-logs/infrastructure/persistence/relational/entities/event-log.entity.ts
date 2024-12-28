import { UserLogEntity } from '../../../../../user-logs/infrastructure/persistence/relational/entities/user-log.entity';

import {
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	JoinColumn,
	OneToOne,
	Column,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { EventLogStatusEnum } from '../../../../types/event-logs.enum';

@Entity({
	name: 'event_log',
})
export class EventLogEntity extends EntityRelationalHelper {
	@Column({
		nullable: false,
		type: String,
		default: EventLogStatusEnum.Pending,
	})
	status?: string;

	@Column({
		nullable: false,
		type: Boolean,
	})
	processed?: boolean;

	@Column({
		nullable: false,
		type: String,
	})
	newValue: string;

	@Column({
		nullable: false,
		type: String,
	})
	oldValue: string;

	@Column({
		nullable: false,
		type: String,
	})
	property: string;

	@Column({
		nullable: false,
		type: String,
	})
	entity: string;

	@OneToOne(() => UserLogEntity, { eager: true, nullable: false })
	@JoinColumn()
	userLog: UserLogEntity;

	@PrimaryGeneratedColumn('uuid')
	id: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
