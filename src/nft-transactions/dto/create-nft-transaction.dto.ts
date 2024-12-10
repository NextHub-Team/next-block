import { NftDto } from '../../nfts/dto/nft.dto';

import { TransactionDto } from '../../transactions/dto/transaction.dto';

export class CreateNftTransactionDto {
  nft?: NftDto;

  transaction?: TransactionDto;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
