// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateOrderTransactionDto } from './create-order-transaction.dto';

export class UpdateOrderTransactionDto extends PartialType(
  CreateOrderTransactionDto,
) {}
