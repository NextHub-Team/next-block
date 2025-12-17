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
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import {
  AccountProviderName,
  AccountStatus,
  KycStatus,
} from '../types/account-enum.type';

export class CreateAccountDto {
  @ApiProperty({
    required: false,
    enum: KycStatus,
    default: KycStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(KycStatus, {
    message: getEnumErrorMessage(KycStatus, 'KYC status'),
  })
  KycStatus?: KycStatus = KycStatus.PENDING;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  label?: string | null;

  @ApiProperty({
    required: false,
    type: () => Object,
  })
  @IsOptional()
  @IsObject()
  metadata?: JsonObject | null;

  @ApiProperty({
    required: false,
    enum: AccountStatus,
    default: AccountStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(AccountStatus, {
    message: getEnumErrorMessage(AccountStatus, 'Status'),
  })
  status?: AccountStatus = AccountStatus.ACTIVE;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  providerAccountId: string;

  @ApiProperty({
    required: true,
    enum: AccountProviderName,
  })
  @IsEnum(AccountProviderName, {
    message: getEnumErrorMessage(AccountProviderName, 'Provider name'),
  })
  providerName: AccountProviderName;

  @ApiProperty({
    required: true,
    type: () => UserDto,
  })
  @ValidateNested()
  @Type(() => UserDto)
  @IsNotEmptyObject()
  user: UserDto;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
