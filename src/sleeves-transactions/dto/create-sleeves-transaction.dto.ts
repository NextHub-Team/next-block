import { FireblocksCwWalletDto } from '../../fireblocks-cw-wallets/dto/fireblocks-cw-wallet.dto';

import { SleevesDto } from '../../sleeves/dto/sleeves.dto';
import { getEnumErrorMessage } from '../../utils/helpers/enum.helper';
import {
  SleevesTransactionPointType,
  SleevesTransactionType,
} from '../types/sleeves-transaction-enum.type';

import {
  // decorators here
  Type,
} from 'class-transformer';

import {
  // decorators here

  ValidateNested,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateSleevesTransactionDto {
  @ApiProperty({
    required: true,
    type: () => FireblocksCwWalletDto,
  })
  @ValidateNested()
  @Type(() => FireblocksCwWalletDto)
  @IsNotEmptyObject()
  wallet: FireblocksCwWalletDto;

  @ApiProperty({
    required: false,
    enum: SleevesTransactionType,
    default: SleevesTransactionType.TRANSFER_IN,
  })
  @IsOptional()
  @IsEnum(SleevesTransactionType, {
    message: getEnumErrorMessage(SleevesTransactionType, 'Type'),
  })
  type?: SleevesTransactionType = SleevesTransactionType.TRANSFER_IN;

  @ApiProperty({
    required: true,
    enum: SleevesTransactionPointType,
    default: SleevesTransactionPointType.REWARD,
  })
  @IsEnum(SleevesTransactionPointType, {
    message: getEnumErrorMessage(SleevesTransactionPointType, 'Point type'),
  })
  pointType: SleevesTransactionPointType = SleevesTransactionPointType.REWARD;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  txHash: string;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  pointCount: number;

  @ApiProperty({
    required: false,
    type: () => Number,
  })
  @IsOptional()
  @IsNumber()
  blockNumber?: number | null;

  @ApiProperty({
    required: true,
    type: () => SleevesDto,
  })
  @ValidateNested()
  @Type(() => SleevesDto)
  @IsNotEmptyObject()
  sleeve: SleevesDto;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
