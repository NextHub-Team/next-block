import { MainWalletEntity } from '../../../../../main-wallets/infrastructure/persistence/relational/entities/main-wallet.entity';

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
  name: 'wallet',
})
export class WalletEntity extends EntityRelationalHelper {
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
