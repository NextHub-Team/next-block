import { NftTransactionEntity } from '../../../../../nft-transactions/infrastructure/persistence/relational/entities/nft-transaction.entity';

import { WalletEntity } from '../../../../../wallets/infrastructure/persistence/relational/entities/wallet.entity';

import {
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	ManyToOne,
	OneToMany,
	Column,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
	name: 'nft',
})
export class NftEntity extends EntityRelationalHelper {
	@Column({
		nullable: true,
		type: String,
	})
	attributes?: string | null;

	@Column({
		nullable: false,
		type: String,
	})
	OwnerAddress: string;

	@Column({
		nullable: false,
		type: String,
	})
	name: string;

	@Column({
		nullable: false,
		type: String,
	})
	objectUri: string;

	@Column({
		nullable: false,
		type: String,
	})
	metadataUri: string;

	@Column({
		nullable: false,
		type: String,
	})
	contractAddress: string;

	@Column({
		nullable: false,
		type: String,
	})
	blockchain: string;

	@Column({
		nullable: false,
		type: String,
	})
	token: string;

	@OneToMany(() => NftTransactionEntity, (childEntity) => childEntity.nft, {
		eager: true,
		nullable: true,
	})
	nftTransactions?: NftTransactionEntity[] | null;

	@ManyToOne(() => WalletEntity, (parentEntity) => parentEntity.nfts, {
		eager: false,
		nullable: false,
	})
	wallet?: WalletEntity;

	@PrimaryGeneratedColumn('uuid')
	id: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
