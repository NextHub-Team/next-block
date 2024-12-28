import {
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	Column,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
	name: 'role',
})
export class RoleEntity extends EntityRelationalHelper {
	@Column({
		nullable: false,
		type: String,
	})
	name: string;

	@Column({
		nullable: true,
		type: String,
	})
	description?: string | null;

	@PrimaryGeneratedColumn('uuid')
	id: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
