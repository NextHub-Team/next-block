import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';
import { UserLogMapper } from '../../../../../user-logs/infrastructure/persistence/relational/mappers/user-log.mapper';

import { MainWalletMapper } from '../../../../../main-wallets/infrastructure/persistence/relational/mappers/main-wallet.mapper';
import { DeviceMapper } from '../../../../../devices/infrastructure/persistence/relational/mappers/device.mapper';
import { FileMapper } from '../../../../../files/infrastructure/persistence/relational/mappers/file.mapper';
import { RoleEntity } from '../../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { StatusEntity } from '../../../../../statuses/infrastructure/persistence/relational/entities/status.entity';
import { User } from '../../../../domain/user';
import { UserEntity } from '../entities/user.entity';

export class UserMapper {
  static toDomain(raw: UserEntity): User {
    const domainEntity = new User();

    if (raw.logs) {
      domainEntity.logs = raw.logs.map((item) => UserLogMapper.toDomain(item));
    } else if (raw.logs === null) {
      domainEntity.logs = null;
    }

    if (raw.mainWallets) {
      domainEntity.mainWallets = raw.mainWallets.map((item) =>
        MainWalletMapper.toDomain(item),
      );
    } else if (raw.mainWallets === null) {
      domainEntity.mainWallets = null;
    }

    domainEntity.phone = raw.phone;

    if (raw.devices) {
      domainEntity.devices = raw.devices.map((item) =>
        DeviceMapper.toDomain(item),
      );
    } else if (raw.devices === null) {
      domainEntity.devices = null;
    }

    domainEntity.id = raw.id;
    domainEntity.email = raw.email;
    domainEntity.password = raw.password;
    domainEntity.provider = raw.provider;
    domainEntity.socialId = raw.socialId;
    domainEntity.firstName = raw.firstName;
    domainEntity.lastName = raw.lastName;
    if (raw.photo) {
      domainEntity.photo = FileMapper.toDomain(raw.photo);
    }
    domainEntity.role = raw.role;
    domainEntity.status = raw.status;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: User): UserEntity {
    let role: RoleEntity | undefined = undefined;

    if (domainEntity.role) {
      role = new RoleEntity();
      role.id = Number(domainEntity.role.id);
    }

    let photo: FileEntity | undefined | null = undefined;

    if (domainEntity.photo) {
      photo = new FileEntity();
      photo.id = domainEntity.photo.id;
      photo.path = domainEntity.photo.path;
    } else if (domainEntity.photo === null) {
      photo = null;
    }

    let status: StatusEntity | undefined = undefined;

    if (domainEntity.status) {
      status = new StatusEntity();
      status.id = Number(domainEntity.status.id);
    }

    const persistenceEntity = new UserEntity();
    if (domainEntity.logs) {
      persistenceEntity.logs = domainEntity.logs.map((item) =>
        UserLogMapper.toPersistence(item),
      );
    } else if (domainEntity.logs === null) {
      persistenceEntity.logs = null;
    }

    if (domainEntity.mainWallets) {
      persistenceEntity.mainWallets = domainEntity.mainWallets.map((item) =>
        MainWalletMapper.toPersistence(item),
      );
    } else if (domainEntity.mainWallets === null) {
      persistenceEntity.mainWallets = null;
    }

    persistenceEntity.phone = domainEntity.phone;

    if (domainEntity.devices) {
      persistenceEntity.devices = domainEntity.devices.map((item) =>
        DeviceMapper.toPersistence(item),
      );
    } else if (domainEntity.devices === null) {
      persistenceEntity.devices = null;
    }

    if (domainEntity.id && typeof domainEntity.id === 'number') {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.email = domainEntity.email;
    persistenceEntity.password = domainEntity.password;
    persistenceEntity.provider = domainEntity.provider;
    persistenceEntity.socialId = domainEntity.socialId;
    persistenceEntity.firstName = domainEntity.firstName;
    persistenceEntity.lastName = domainEntity.lastName;
    persistenceEntity.photo = photo;
    persistenceEntity.role = role;
    persistenceEntity.status = status;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    persistenceEntity.deletedAt = domainEntity.deletedAt;
    return persistenceEntity;
  }
}
