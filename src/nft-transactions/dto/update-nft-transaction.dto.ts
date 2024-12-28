// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateNftTransactionDto } from './create-nft-transaction.dto';

export class UpdateNftTransactionDto extends PartialType(
	CreateNftTransactionDto,
) {}
