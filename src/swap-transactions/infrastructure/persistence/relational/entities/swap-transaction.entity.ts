import { TransactionEntity } from '../../../../../transactions/infrastructure/persistence/relational/entities/transaction.entity';

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

@Entity({
  name: 'swap_transaction',
})
export class SwapTransactionEntity extends EntityRelationalHelper {
  @Column({
    nullable: false,
    type: Number,
  })
  transaction_fee: number;

  @Column({
    nullable: false,
    type: String,
  })
  dex: string;

  @Column({
    nullable: false,
    type: Number,
  })
  amount_out: number;

  @Column({
    nullable: false,
    type: Number,
  })
  amount_in: number;

  @Column({
    nullable: false,
    type: String,
  })
  to_token: string;

  @Column({
    nullable: false,
    type: Number,
  })
  wallet: number;

  @Column({
    nullable: false,
    type: String,
  })
  from_token: string;

  @OneToOne(() => TransactionEntity, { eager: true, nullable: false })
  @JoinColumn()
  transaction?: TransactionEntity;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
