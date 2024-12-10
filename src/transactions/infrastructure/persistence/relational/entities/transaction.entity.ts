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
  name: 'transaction',
})
export class TransactionEntity extends EntityRelationalHelper {
  @Column({
    nullable: true,
    type: String,
  })
  details: string;

  @Column({
    nullable: false,
    type: String,
  })
  asset: string;

  @Column({
    nullable: false,
    type: String,
  })
  priority: string;

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

  @ManyToOne(() => WalletEntity, (parentEntity) => parentEntity.transactions, {
    eager: false,
    nullable: false,
  })
  wallet: WalletEntity;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
