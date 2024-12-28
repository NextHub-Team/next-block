import { WhiteListAddress } from '../../../../domain/white-list-address';

import { WhiteListAddressEntity } from '../entities/white-list-address.entity';

export class WhiteListAddressMapper {
	static toDomain(raw: WhiteListAddressEntity): WhiteListAddress {
		const domainEntity = new WhiteListAddress();
		domainEntity.label = raw.label;

		domainEntity.description = raw.description;

		domainEntity.address = raw.address;

		domainEntity.id = raw.id;
		domainEntity.createdAt = raw.createdAt;
		domainEntity.updatedAt = raw.updatedAt;

		return domainEntity;
	}

	static toPersistence(domainEntity: WhiteListAddress): WhiteListAddressEntity {
		const persistenceEntity = new WhiteListAddressEntity();
		persistenceEntity.label = domainEntity.label;

		persistenceEntity.description = domainEntity.description;

		persistenceEntity.address = domainEntity.address;

		if (domainEntity.id) {
			persistenceEntity.id = domainEntity.id;
		}
		persistenceEntity.createdAt = domainEntity.createdAt;
		persistenceEntity.updatedAt = domainEntity.updatedAt;

		return persistenceEntity;
	}
}
