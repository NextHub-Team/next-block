import { UserDto } from '../../users/dto/user.dto';
import { JsonObject } from '../../utils/types/object.type';
import { getEnumErrorMessage } from '../../utils/helpers/enum.helper';
import { Type } from 'class-transformer';

import {
  ValidateNested,
  IsNotEmptyObject,
  IsString,
  IsOptional,
  IsEnum,
  IsObject,
  MaxLength,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  AccountProviderName,
  AccountStatus,
  KycStatus,
} from '../types/account-enum.type';

export class BaseAccountPayloadDto {
  @ApiPropertyOptional({
    description: 'KYC status reported by the provider',
    enum: KycStatus,
    default: KycStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(KycStatus, {
    message: getEnumErrorMessage(KycStatus, 'KYC status'),
  })
  KycStatus?: KycStatus = KycStatus.PENDING;

  @ApiPropertyOptional({
    description: 'Human-friendly label to identify the account',
    type: String,
    example: 'Primary Coinbase account',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  label?: string | null;

  @ApiPropertyOptional({
    description: 'Arbitrary metadata that describes the account',
    type: () => Object,
    example: { tier: 'gold', region: 'US' },
  })
  @IsOptional()
  @IsObject()
  metadata?: JsonObject | null;

  @ApiPropertyOptional({
    description: 'Operational status of the account',
    enum: AccountStatus,
    default: AccountStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(AccountStatus, {
    message: getEnumErrorMessage(AccountStatus, 'Status'),
  })
  status?: AccountStatus = AccountStatus.ACTIVE;

  @ApiProperty({
    description: 'Identifier of the account on the provider side',
    type: String,
    example: 'acct_1234567890',
  })
  @IsString()
  @MaxLength(255)
  providerAccountId: string;

  @ApiProperty({
    description: 'Provider that manages the account',
    enum: AccountProviderName,
  })
  @IsEnum(AccountProviderName, {
    message: getEnumErrorMessage(AccountProviderName, 'Provider name'),
  })
  providerName: AccountProviderName;
}

export class CreateAccountUserDto extends BaseAccountPayloadDto {}

export class CreateAccountDto extends BaseAccountPayloadDto {
  @ApiProperty({
    description: 'User that will own the account',
    type: () => UserDto,
  })
  @ValidateNested()
  @Type(() => UserDto)
  @IsNotEmptyObject()
  user: UserDto;
}
