import { Type } from '../../../../domain/type';
import { TypeEntity } from '../entities/type.entity';

export class TypeMapper {
	static toDomain(raw: TypeEntity): Type {
		const domainEntity = new Type();
		domainEntity.id = raw.id;
		domainEntity.createdAt = raw.createdAt;
		domainEntity.updatedAt = raw.updatedAt;

		return domainEntity;
	}

	static toPersistence(domainEntity: Type): TypeEntity {
		const persistenceEntity = new TypeEntity();
		if (domainEntity.id) {
			persistenceEntity.id = domainEntity.id;
		}
		persistenceEntity.createdAt = domainEntity.createdAt;
		persistenceEntity.updatedAt = domainEntity.updatedAt;

		return persistenceEntity;
	}
}
