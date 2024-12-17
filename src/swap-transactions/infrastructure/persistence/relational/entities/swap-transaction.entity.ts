import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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
  fee: number;

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

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
