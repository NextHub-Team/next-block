import { WalletEntity } from '../../../../../wallets/infrastructure/persistence/relational/entities/wallet.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'transaction',
})
export class TransactionEntity extends EntityRelationalHelper {
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
