import { WalletEntity } from '../../../../../wallets/infrastructure/persistence/relational/entities/wallet.entity';

import { PassphraseEntity } from '../../../../../passphrases/infrastructure/persistence/relational/entities/passphrase.entity';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

import {
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	ManyToOne,
	JoinColumn,
	OneToOne,
	Column,
	OneToMany,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
	name: 'main_wallet',
})
export class MainWalletEntity extends EntityRelationalHelper {
	@Column({
		nullable: true,
		type: String,
	})
	type?: string | null;

	@Column({
		nullable: true,
		type: String,
	})
	name?: string | null;

	@OneToMany(() => WalletEntity, (childEntity) => childEntity.mainWallet, {
		eager: true,
		nullable: true,
	})
	wallets?: WalletEntity[] | null;

	@Column({
		nullable: false,
		type: String,
	})
	address: string;

	@OneToOne(() => PassphraseEntity, { eager: true, nullable: false })
	@JoinColumn()
	passphrase: PassphraseEntity;

	@ManyToOne(() => UserEntity, (parentEntity) => parentEntity.mainWallets, {
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
