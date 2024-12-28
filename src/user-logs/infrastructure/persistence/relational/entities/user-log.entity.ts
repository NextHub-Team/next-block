import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

import {
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	ManyToOne,
	Column,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
	name: 'user_log',
})
export class UserLogEntity extends EntityRelationalHelper {
	@Column({
		nullable: false,
		type: String,
	})
	event: string;

	@Column({ type: 'json', nullable: true })
	details?: Record<string, any> | null;

	@ManyToOne(() => UserEntity, (parentEntity) => parentEntity.logs, {
		eager: false,
		nullable: false,
	})
	user: UserEntity;

	@PrimaryGeneratedColumn('uuid')
	id: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
