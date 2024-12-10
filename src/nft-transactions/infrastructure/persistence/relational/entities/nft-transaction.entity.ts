import { NftEntity } from '../../../../../nfts/infrastructure/persistence/relational/entities/nft.entity';

import { TransactionEntity } from '../../../../../transactions/infrastructure/persistence/relational/entities/transaction.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'nft_transaction',
})
export class NftTransactionEntity extends EntityRelationalHelper {
  @ManyToOne(() => NftEntity, (parentEntity) => parentEntity.nftTransactions, {
    eager: false,
    nullable: false,
  })
  nft?: NftEntity;

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
