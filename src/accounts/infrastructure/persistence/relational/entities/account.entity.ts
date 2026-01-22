import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

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
  AccountProviderName,
  AccountStatus,
  KycStatus,
} from '../../../../types/account-enum.type';

@Entity({
  name: 'account',
})
export class AccountEntity extends EntityRelationalHelper {
  @Column({
    nullable: true,
    type: String,
  })
  customerRefId: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  name: string | null;

  @Column({
    nullable: false,
    type: 'enum',
    enum: KycStatus,
    enumName: 'account_kyc_status_enum',
    default: KycStatus.PENDING,
    name: 'KycStatus',
  })
  kycStatus?: KycStatus;

  @Column({
    nullable: true,
    type: String,
  })
  label?: string | null;

  @Column({
    nullable: false,
    type: 'enum',
    enum: AccountStatus,
    enumName: 'account_status_enum',
    default: AccountStatus.ACTIVE,
  })
  status?: AccountStatus;

  @Column({
    nullable: false,
    type: String,
  })
  accountId: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: AccountProviderName,
    enumName: 'account_provider_name_enum',
  })
  providerName: AccountProviderName;

  @ManyToOne(() => UserEntity, { eager: true, nullable: false })
  user: UserEntity;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
