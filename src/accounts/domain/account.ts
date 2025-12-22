import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';
import { JsonObject } from '../../utils/types/object.type';
import {
  AccountProviderName,
  AccountStatus,
  KycStatus,
} from '../types/account-enum.type';

export class Account {
  @ApiProperty({
    enum: KycStatus,
    default: KycStatus.PENDING,
    nullable: false,
  })
  KycStatus?: KycStatus = KycStatus.PENDING;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  label?: string | null;

  @ApiProperty({
    type: Object,
    nullable: true,
  })
  metadata?: JsonObject | null;

  @ApiProperty({
    enum: AccountStatus,
    default: AccountStatus.ACTIVE,
    nullable: false,
  })
  status?: AccountStatus = AccountStatus.ACTIVE;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  providerAccountId: string;

  @ApiProperty({
    enum: AccountProviderName,
    nullable: false,
  })
  providerName: AccountProviderName;

  @ApiProperty({
    type: () => User,
    nullable: false,
  })
  user: User;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
