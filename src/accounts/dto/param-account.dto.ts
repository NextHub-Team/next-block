import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsString, IsUUID } from 'class-validator';
import { AccountProviderName } from '../types/account-enum.type';

export class AccountIdParamDto {
  @ApiProperty({
    description: 'Account identifier (UUID)',
    type: String,
    example: '0d18f45a-4b27-4c1a-9e68-432fd6f4084f',
  })
  @IsUUID()
  id: string;
}

export class AccountUserIdParamDto {
  @ApiProperty({
    description: 'User identifier associated with the account (numeric)',
    type: String,
    example: '42',
  })
  @IsNumberString()
  userId: string;
}

export class AccountSocialIdParamDto {
  @ApiProperty({
    description: 'User social identifier associated with the account',
    type: String,
    example: 'd21f0a37-4d7e-42b2-9c5e-07aa1d3d76f0',
  })
  @IsString()
  socialId: string;
}

export class AccountProviderAccountIdParamDto {
  @ApiProperty({
    description: 'Provider account identifier used to reference the account',
    type: String,
    example: 'acct_1234567890',
  })
  @IsString()
  providerAccountId: string;
}

export class AccountProviderNameParamDto {
  @ApiProperty({
    description: 'Account provider name',
    enum: AccountProviderName,
  })
  @IsEnum(AccountProviderName)
  providerName: AccountProviderName;
}
