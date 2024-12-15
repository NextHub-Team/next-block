import { AccessControlEntity } from '../../../../../access-controls/infrastructure/persistence/relational/entities/access-control.entity';

import { UserLogEntity } from '../../../../../user-logs/infrastructure/persistence/relational/entities/user-log.entity';
import { MainWalletEntity } from '../../../../../main-wallets/infrastructure/persistence/relational/entities/main-wallet.entity';
import { DeviceEntity } from '../../../../../devices/infrastructure/persistence/relational/entities/device.entity';

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';

import { AuthProvidersEnum } from '../../../../../auth/auth-providers.enum';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'user',
})
export class UserEntity extends EntityRelationalHelper {
  @OneToOne(() => AccessControlEntity, { eager: true, nullable: true })
  @JoinColumn()
  abilities?: AccessControlEntity | null;

  @OneToMany(() => UserLogEntity, (childEntity) => childEntity.user, {
    eager: false,
    nullable: true,
  })
  logs?: UserLogEntity[] | null;

  @OneToMany(() => MainWalletEntity, (childEntity) => childEntity.user, {
    eager: false,
    nullable: true,
  })
  mainWallets?: MainWalletEntity[] | null;

  @Column({
    nullable: true,
    type: String,
  })
  phone?: string | null;

  @OneToMany(() => DeviceEntity, (childEntity) => childEntity.user, {
    eager: false,
    nullable: true,
  })
  devices?: DeviceEntity[] | null;

  @PrimaryGeneratedColumn()
  id: number;

  // For "string | null" we need to use String type.
  // More info: https://github.com/typeorm/typeorm/issues/2567
  @Column({ type: String, unique: true, nullable: true })
  email: string | null;

  @Column({ nullable: true })
  password?: string;

  @Column({ default: AuthProvidersEnum.email })
  provider: string;

  @Index()
  @Column({ type: String, nullable: true })
  socialId?: string | null;

  @Index()
  @Column({ type: String, nullable: true })
  firstName: string | null;

  @Index()
  @Column({ type: String, nullable: true })
  lastName: string | null;

  @OneToOne(() => FileEntity, {
    eager: true,
  })
  @JoinColumn()
  photo?: FileEntity | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
