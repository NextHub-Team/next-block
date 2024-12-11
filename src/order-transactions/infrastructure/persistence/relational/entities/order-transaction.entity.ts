import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'order_transaction',
})
export class OrderTransactionEntity extends EntityRelationalHelper {
  @Column({
    nullable: false,
    type: String,
  })
  type: string;

  @Column({
    nullable: false,
    type: Number,
  })
  fee: number;

  @Column({
    nullable: true,
    type: String,
  })
  paymentMethod?: string | null;

  @Column({
    nullable: false,
    type: Number,
  })
  totalValue: number;

  @Column({
    nullable: false,
    type: Number,
  })
  price: number;

  @Column({
    nullable: false,
    type: Number,
  })
  cryptoAmount: number;

  @Column({
    nullable: true,
    type: Number,
  })
  currencyAmount?: number | null;

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
