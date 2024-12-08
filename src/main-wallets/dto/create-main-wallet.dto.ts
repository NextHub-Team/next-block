import { WalletDto } from '../../wallets/dto/wallet.dto';

import { UserDto } from '../../users/dto/user.dto';

import {
  // decorators here
  Type,
} from 'class-transformer';

import {
  // decorators here

  ValidateNested,
  IsNotEmptyObject,
  IsString,
  IsArray,
  IsOptional,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';
import { PassphraseDto } from '../../passphrases/dto/passphrase.dto';

export class CreateMainWalletDto {
  @ApiProperty({
    required: false,
    type: () => [WalletDto],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => WalletDto)
  @IsArray()
  wallets?: WalletDto[] | null;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  address: string;

  @ApiProperty({
    required: true,
    type: () => PassphraseDto,
  })
  @ValidateNested()
  @Type(() => PassphraseDto)
  @IsNotEmptyObject()
  passphrase: PassphraseDto;

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
