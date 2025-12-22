import { AccountEntity } from '../../../../../accounts/infrastructure/persistence/relational/entities/account.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { FireblocksCwWalletAsset } from '../../../../types/fireblocks-cw-wallet.type';

@Entity({
  name: 'fireblocks_cw_wallet',
})
export class FireblocksCwWalletEntity extends EntityRelationalHelper {
  @ManyToOne(() => AccountEntity, { eager: true, nullable: false })
  account: AccountEntity;

  @Column({
    nullable: true,
    type: 'jsonb',
  })
  assets?: FireblocksCwWalletAsset[] | null;

  @Column({
    nullable: false,
    type: String,
  })
  vaultType?: string;

  @Column({
    nullable: false,
    type: Boolean,
  })
  autoFuel?: boolean;

  @Column({
    nullable: false,
    type: Boolean,
  })
  hiddenOnUI?: boolean;

  @Column({
    nullable: false,
    type: String,
  })
  name: string;

  @Column({
    nullable: false,
    type: String,
  })
  customerRefId: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
