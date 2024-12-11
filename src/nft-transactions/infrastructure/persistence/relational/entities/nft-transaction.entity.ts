import { NftEntity } from '../../../../../nfts/infrastructure/persistence/relational/entities/nft.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
