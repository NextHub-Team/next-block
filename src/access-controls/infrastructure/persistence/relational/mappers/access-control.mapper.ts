import { AccessControl } from '../../../../domain/access-control';

import { PermissionMapper } from '../../../../../permissions/infrastructure/persistence/relational/mappers/permission.mapper';

import { StatusMapper } from '../../../../../statuses/infrastructure/persistence/relational/mappers/status.mapper';

import { RoleMapper } from '../../../../../roles/infrastructure/persistence/relational/mappers/role.mapper';

import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { AccessControlEntity } from '../entities/access-control.entity';

export class AccessControlMapper {
	static toDomain(raw: AccessControlEntity): AccessControl {
		const domainEntity = new AccessControl();
		domainEntity.description = raw.description;

		if (raw.permission) {
			domainEntity.permission = PermissionMapper.toDomain(raw.permission);
		} else if (raw.permission === null) {
			domainEntity.permission = null;
		}

		if (raw.status) {
			domainEntity.status = StatusMapper.toDomain(raw.status);
		} else if (raw.status === null) {
			domainEntity.status = null;
		}

		if (raw.role) {
			domainEntity.role = RoleMapper.toDomain(raw.role);
		}

		if (raw.user) {
			domainEntity.user = UserMapper.toDomain(raw.user);
		}

		domainEntity.id = raw.id;
		domainEntity.createdAt = raw.createdAt;
		domainEntity.updatedAt = raw.updatedAt;

		return domainEntity;
	}

	static toPersistence(domainEntity: AccessControl): AccessControlEntity {
		const persistenceEntity = new AccessControlEntity();
		persistenceEntity.description = domainEntity.description;

		if (domainEntity.permission) {
			persistenceEntity.permission = PermissionMapper.toPersistence(
				domainEntity.permission,
			);
		} else if (domainEntity.permission === null) {
			persistenceEntity.permission = null;
		}

		if (domainEntity.status) {
			persistenceEntity.status = StatusMapper.toPersistence(
				domainEntity.status,
			);
		} else if (domainEntity.status === null) {
			persistenceEntity.status = null;
		}

		if (domainEntity.role) {
			persistenceEntity.role = RoleMapper.toPersistence(domainEntity.role);
		}

		if (domainEntity.user) {
			persistenceEntity.user = UserMapper.toPersistence(domainEntity.user);
		}

		if (domainEntity.id) {
			persistenceEntity.id = domainEntity.id;
		}
		persistenceEntity.createdAt = domainEntity.createdAt;
		persistenceEntity.updatedAt = domainEntity.updatedAt;

		return persistenceEntity;
	}
}
