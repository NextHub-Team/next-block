import { NftDto } from '../../nfts/dto/nft.dto';
export class CreateNftTransactionDto {
  nft?: NftDto;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
