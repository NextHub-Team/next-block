import { SleevesTransactionEntity } from '../../../../../sleeves-transactions/infrastructure/persistence/relational/entities/sleeves-transaction.entity';

import { AccountEntity } from '../../../../../accounts/infrastructure/persistence/relational/entities/account.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'fireblocks_cw_wallet',
})
export class FireblocksCwWalletEntity extends EntityRelationalHelper {
  @OneToMany(
    () => SleevesTransactionEntity,
    (childEntity) => childEntity.wallet,
    { eager: true, nullable: true },
  )
  sleevesTransactions?: SleevesTransactionEntity[] | null;

  @ManyToOne(() => AccountEntity, { eager: true, nullable: false })
  account: AccountEntity;

  @Column({
    nullable: false,
    type: 'varchar',
  })
  assetId: string;

  @Column({
    nullable: false,
    type: 'varchar',
  })
  address: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
