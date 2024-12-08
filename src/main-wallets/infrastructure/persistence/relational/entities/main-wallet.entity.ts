import { PassphraseEntity } from '../../../../../passphrases/infrastructure/persistence/relational/entities/passphrase.entity';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  Column,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'main_wallet',
})
export class MainWalletEntity extends EntityRelationalHelper {
  @Column({
    nullable: false,
    type: String,
  })
  address: string;

  @OneToOne(() => PassphraseEntity, { eager: true, nullable: false })
  @JoinColumn()
  passphrase: PassphraseEntity;

  @ManyToOne(() => UserEntity, (parentEntity) => parentEntity.minWallets, {
    eager: false,
    nullable: false,
  })
  user: UserEntity;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
