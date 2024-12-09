import { TransactionDto } from '../../transactions/dto/transaction.dto';

export class CreateTransferTransactionDto {
  transaction?: TransactionDto;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
