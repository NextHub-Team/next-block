import { NFT } from '../../../../domain/nft';
import { NFTEntity } from '../entities/nft.entity';

export class NFTMapper {
  static toDomain(raw: NFTEntity): NFT {
    const domainEntity = new NFT();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: NFT): NFTEntity {
    const persistenceEntity = new NFTEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
