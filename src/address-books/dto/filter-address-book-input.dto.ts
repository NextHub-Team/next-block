import { User } from '../../users/domain/user';
import { AddressBook } from '../domain/address-book';

export class FilterAddressBooksInputDto {
  userId?: User['id'];

  blockchain?: AddressBook['blockchain'];

  assetType?: AddressBook['assetType'];

  isFavorite?: AddressBook['isFavorite'];

  label?: AddressBook['label'];
}
