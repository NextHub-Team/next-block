import { WalletDto } from '../../wallets/dto/wallet.dto';

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

export class CreateTransactionLogDto {
  @ApiProperty({
    required: true,
    type: () => WalletDto,
  })
  @ValidateNested()
  @Type(() => WalletDto)
  @IsNotEmptyObject()
  wallet: WalletDto;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
