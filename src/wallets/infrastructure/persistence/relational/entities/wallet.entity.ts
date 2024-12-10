import { NftEntity } from '../../../../../nfts/infrastructure/persistence/relational/entities/nft.entity';

import { TransactionEntity } from '../../../../../transactions/infrastructure/persistence/relational/entities/transaction.entity';

import { MainWalletEntity } from '../../../../../main-wallets/infrastructure/persistence/relational/entities/main-wallet.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  OneToMany,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'wallet',
})
export class WalletEntity extends EntityRelationalHelper {
  @OneToMany(() => NftEntity, (childEntity) => childEntity.wallet, {
    eager: true,
    nullable: true,
  })
  nfts?: NftEntity[] | null;

  @OneToMany(() => TransactionEntity, (childEntity) => childEntity.wallet, {
    eager: true,
    nullable: true,
  })
  transactions?: TransactionEntity[] | null;

  @Column({
    nullable: false,
    type: String,
  })
  legacyAddress: string;

  @Column({
    nullable: false,
    type: String,
  })
  blockchain: string;

  @Column({
    nullable: false,
    type: String,
  })
  address: string;

  @ManyToOne(() => MainWalletEntity, (parentEntity) => parentEntity.wallets, {
    eager: false,
    nullable: false,
  })
  mainWallet: MainWalletEntity;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
