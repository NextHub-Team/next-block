// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateSwapTransactionDto } from './create-swap-transaction.dto';

export class UpdateSwapTransactionDto extends PartialType(
	CreateSwapTransactionDto,
) {}
