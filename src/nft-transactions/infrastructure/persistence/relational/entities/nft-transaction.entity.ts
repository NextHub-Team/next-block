import { NftEntity } from '../../../../../nfts/infrastructure/persistence/relational/entities/nft.entity';

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
  name: 'nft_transaction',
})
export class NftTransactionEntity extends EntityRelationalHelper {
  @Column({
    nullable: true,
    type: Number,
  })
  gasFee?: number | null;

  @Column({
    nullable: false,
    type: String,
  })
  transactionHash: string;

  @Column({
    nullable: false,
    type: String,
  })
  toAddress: string;

  @Column({
    nullable: false,
    type: String,
  })
  fromAddress: string;

  @Column({
    nullable: false,
    type: String,
  })
  contractAddress: string;

  @Column({
    nullable: false,
    type: String,
  })
  blockchain: string;

  @Column({
    nullable: false,
    type: Number,
  })
  wallet: number;

  @ManyToOne(() => NftEntity, (parentEntity) => parentEntity.nftTransactions, {
    eager: false,
    nullable: false,
  })
  nft?: NftEntity;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
