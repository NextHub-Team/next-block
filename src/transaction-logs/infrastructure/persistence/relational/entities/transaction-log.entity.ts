import { WalletEntity } from '../../../../../wallets/infrastructure/persistence/relational/entities/wallet.entity';
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
	name: 'transaction_log',
})
export class TransactionLogEntity extends EntityRelationalHelper {
	@Column({
		nullable: true,
		type: String,
	})
	details?: string | null;

	@Column({
		nullable: true,
		type: String,
	})
	priority?: string | null;

	@Column({
		nullable: false,
		type: String,
	})
	status: string;

	@Column({
		nullable: false,
		type: String,
	})
	type: string;

	@Column({
		nullable: false,
		type: String,
	})
	assetName: string;

	@ManyToOne(
		() => WalletEntity,
		(parentEntity) => parentEntity.transactionLog,
		{ eager: false, nullable: false },
	)
	wallet?: WalletEntity;

	@PrimaryGeneratedColumn('uuid')
	id: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
