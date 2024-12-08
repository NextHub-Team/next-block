import { MainWalletDto } from '../../main-wallets/dto/main-wallet.dto';

import {
  // decorators here
  Type,
} from 'class-transformer';

import {
  // decorators here

  ValidateNested,
  IsNotEmptyObject,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateWalletDto {
  @ApiProperty({
    required: true,
    type: () => MainWalletDto,
  })
  @ValidateNested()
  @Type(() => MainWalletDto)
  @IsNotEmptyObject()
  mainWallet: MainWalletDto;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
