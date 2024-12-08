import { Passphrase } from '../../../../domain/passphrase';

import { PassphraseEntity } from '../entities/passphrase.entity';

export class PassphraseMapper {
  static toDomain(raw: PassphraseEntity): Passphrase {
    const domainEntity = new Passphrase();
    domainEntity.location = raw.location;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Passphrase): PassphraseEntity {
    const persistenceEntity = new PassphraseEntity();
    persistenceEntity.location = domainEntity.location;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
