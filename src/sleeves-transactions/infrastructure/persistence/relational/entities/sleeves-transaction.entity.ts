import { FireblocksCwWalletEntity } from '../../../../../fireblocks-cw-wallets/infrastructure/persistence/relational/entities/fireblocks-cw-wallet.entity';

import { SleevesEntity } from '../../../../../sleeves/infrastructure/persistence/relational/entities/sleeves.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import {
  SleevesTransactionPointType,
  SleevesTransactionType,
} from '../../../../types/sleeves-transaction-enum.type';

@Entity({
  name: 'sleeves_transaction',
})
export class SleevesTransactionEntity extends EntityRelationalHelper {
  @ManyToOne(
    () => FireblocksCwWalletEntity,
    (parentEntity) => parentEntity.sleevesTransactions,
    { eager: false, nullable: false },
  )
  wallet?: FireblocksCwWalletEntity;

  @Column({
    nullable: false,
    type: 'enum',
    enum: SleevesTransactionType,
    enumName: 'sleeves_transaction_type_enum',
    default: SleevesTransactionType.TRANSFER_IN,
  })
  type?: SleevesTransactionType;

  @Column({
    nullable: false,
    type: 'enum',
    enum: SleevesTransactionPointType,
    enumName: 'sleeves_transaction_point_type_enum',
    default: SleevesTransactionPointType.REWARD,
  })
  pointType: SleevesTransactionPointType;

  @Column({
    nullable: false,
    type: String,
  })
  txHash: string;

  @Column({
    nullable: false,
    type: Number,
  })
  pointCount: number;

  @Column({
    nullable: true,
    type: Number,
  })
  blockNumber?: number | null;

  @ManyToOne(() => SleevesEntity, { eager: true, nullable: false })
  sleeve: SleevesEntity;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
