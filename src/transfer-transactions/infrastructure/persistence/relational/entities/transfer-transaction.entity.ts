import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'transfer_transaction',
})
export class TransferTransactionEntity extends EntityRelationalHelper {
  @Column({
    nullable: false,
    type: String,
  })
  fromAddress: string;

  @Column({
    nullable: false,
    type: String,
  })
  toAddress: string;

  @Column({
    nullable: false,
    type: Number,
  })
  fee: number;

  @Column({
    nullable: false,
    type: Number,
  })
  amount: number;

  @Column({
    nullable: false,
    type: String,
  })
  blockchain: string;

  @Column({
    nullable: false,
    type: String,
  })
  transactionHash: string;

  @Column({
    nullable: false,
    type: Number,
  })
  wallet: number;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
