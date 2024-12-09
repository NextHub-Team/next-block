import { TransactionDto } from '../../transactions/dto/transaction.dto';

export class CreateOrderTransactionDto {
  transaction?: TransactionDto;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
