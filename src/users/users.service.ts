import { UserLogsService } from '../user-logs/user-logs.service';
import { UserLog } from '../user-logs/domain/user-log';

import { MainWalletsService } from '../main-wallets/main-wallets.service';
import { MainWallet } from '../main-wallets/domain/main-wallet';

import { PermissionsService } from '../permissions/permissions.service';
import { Permission } from '../permissions/domain/permission';

import { DevicesService } from '../devices/devices.service';
import { Device } from '../devices/domain/device';

import {
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { NullableType } from '../utils/types/nullable.type';
import { FilterUserDto, SortUserDto } from './dto/query-user.dto';
import { UserRepository } from './infrastructure/persistence/user.repository';
import { User } from './domain/user';
import bcrypt from 'bcryptjs';
import { AuthProvidersEnum } from '../auth/auth-providers.enum';
import { FilesService } from '../files/files.service';
import { RoleEnum } from '../roles/roles.enum';
import { StatusEnum } from '../statuses/statuses.enum';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { FileType } from '../files/domain/file';
import { Role } from '../roles/domain/role';
import { Status } from '../statuses/domain/status';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => UserLogsService))
    private readonly userLogService: UserLogsService,

    @Inject(forwardRef(() => MainWalletsService))
    private readonly mainWalletService: MainWalletsService,

    @Inject(forwardRef(() => PermissionsService))
    private readonly permissionService: PermissionsService,
    @Inject(forwardRef(() => DevicesService))
    private readonly deviceService: DevicesService,
    private readonly usersRepository: UserRepository,
    private readonly filesService: FilesService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Do not remove comment below.
    // <creating-property />
    let logs: UserLog[] | null | undefined = undefined;

    if (createUserDto.logs) {
      const logsObjects = await this.userLogService.findByIds(
        createUserDto.logs.map((entity) => entity.id),
      );
      if (logsObjects.length !== createUserDto.logs.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            logs: 'notExists',
          },
        });
      }
      logs = logsObjects;
    } else if (createUserDto.logs === null) {
      logs = null;
    }

    let mainWallets: MainWallet[] | null | undefined = undefined;

    if (createUserDto.mainWallets) {
      const mainWalletsObjects = await this.mainWalletService.findByIds(
        createUserDto.mainWallets.map((entity) => entity.id),
      );
      if (mainWalletsObjects.length !== createUserDto.mainWallets.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            mainWallets: 'notExists',
          },
        });
      }
      mainWallets = mainWalletsObjects;
    } else if (createUserDto.mainWallets === null) {
      mainWallets = null;
    }

    let permissions: Permission[] | null | undefined = undefined;

    if (createUserDto.permissions) {
      const permissionsObjects = await this.permissionService.findByIds(
        createUserDto.permissions.map((entity) => entity.id),
      );
      if (permissionsObjects.length !== createUserDto.permissions.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            permissions: 'notExists',
          },
        });
      }
      permissions = permissionsObjects;
    } else if (createUserDto.permissions === null) {
      permissions = null;
    }

    let devices: Device[] | null | undefined = undefined;

    if (createUserDto.devices) {
      const devicesObjects = await this.deviceService.findByIds(
        createUserDto.devices.map((entity) => entity.id),
      );
      if (devicesObjects.length !== createUserDto.devices.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            devices: 'notExists',
          },
        });
      }
      devices = devicesObjects;
    } else if (createUserDto.devices === null) {
      devices = null;
    }

    let password: string | undefined = undefined;

    if (createUserDto.password) {
      const salt = await bcrypt.genSalt();
      password = await bcrypt.hash(createUserDto.password, salt);
    }

    let email: string | null = null;

    if (createUserDto.email) {
      const userObject = await this.usersRepository.findByEmail(
        createUserDto.email,
      );
      if (userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailAlreadyExists',
          },
        });
      }
      email = createUserDto.email;
    }

    let photo: FileType | null | undefined = undefined;

    if (createUserDto.photo?.id) {
      const fileObject = await this.filesService.findById(
        createUserDto.photo.id,
      );
      if (!fileObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            photo: 'imageNotExists',
          },
        });
      }
      photo = fileObject;
    } else if (createUserDto.photo === null) {
      photo = null;
    }

    let role: Role | undefined = undefined;

    if (createUserDto.role?.id) {
      const roleObject = Object.values(RoleEnum)
        .map(String)
        .includes(String(createUserDto.role.id));
      if (!roleObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'roleNotExists',
          },
        });
      }

      role = {
        id: createUserDto.role.id,
      };
    }

    let status: Status | undefined = undefined;

    if (createUserDto.status?.id) {
      const statusObject = Object.values(StatusEnum)
        .map(String)
        .includes(String(createUserDto.status.id));
      if (!statusObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            status: 'statusNotExists',
          },
        });
      }

      status = {
        id: createUserDto.status.id,
      };
    }

    return this.usersRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      logs,

      mainWallets,

      permissions,

      phone: createUserDto.phone,

      devices,

      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: email,
      password: password,
      photo: photo,
      role: role,
      status: status,
      provider: createUserDto.provider ?? AuthProvidersEnum.email,
      socialId: createUserDto.socialId,
    });
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<User[]> {
    return this.usersRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  findById(id: User['id']): Promise<NullableType<User>> {
    return this.usersRepository.findById(id);
  }

  findByIds(ids: User['id'][]): Promise<User[]> {
    return this.usersRepository.findByIds(ids);
  }

  findByEmail(email: User['email']): Promise<NullableType<User>> {
    return this.usersRepository.findByEmail(email);
  }

  findBySocialIdAndProvider({
    socialId,
    provider,
  }: {
    socialId: User['socialId'];
    provider: User['provider'];
  }): Promise<NullableType<User>> {
    return this.usersRepository.findBySocialIdAndProvider({
      socialId,
      provider,
    });
  }

  async update(
    id: User['id'],
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    // Do not remove comment below.
    // <updating-property />
    let logs: UserLog[] | null | undefined = undefined;

    if (updateUserDto.logs) {
      const logsObjects = await this.userLogService.findByIds(
        updateUserDto.logs.map((entity) => entity.id),
      );
      if (logsObjects.length !== updateUserDto.logs.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            logs: 'notExists',
          },
        });
      }
      logs = logsObjects;
    } else if (updateUserDto.logs === null) {
      logs = null;
    }

    let mainWallets: MainWallet[] | null | undefined = undefined;

    if (updateUserDto.mainWallets) {
      const mainWalletsObjects = await this.mainWalletService.findByIds(
        updateUserDto.mainWallets.map((entity) => entity.id),
      );
      if (mainWalletsObjects.length !== updateUserDto.mainWallets.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            mainWallets: 'notExists',
          },
        });
      }
      mainWallets = mainWalletsObjects;
    } else if (updateUserDto.mainWallets === null) {
      mainWallets = null;
    }

    let permissions: Permission[] | null | undefined = undefined;

    if (updateUserDto.permissions) {
      const permissionsObjects = await this.permissionService.findByIds(
        updateUserDto.permissions.map((entity) => entity.id),
      );
      if (permissionsObjects.length !== updateUserDto.permissions.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            permissions: 'notExists',
          },
        });
      }
      permissions = permissionsObjects;
    } else if (updateUserDto.permissions === null) {
      permissions = null;
    }

    let devices: Device[] | null | undefined = undefined;

    if (updateUserDto.devices) {
      const devicesObjects = await this.deviceService.findByIds(
        updateUserDto.devices.map((entity) => entity.id),
      );
      if (devicesObjects.length !== updateUserDto.devices.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            devices: 'notExists',
          },
        });
      }
      devices = devicesObjects;
    } else if (updateUserDto.devices === null) {
      devices = null;
    }

    let password: string | undefined = undefined;

    if (updateUserDto.password) {
      const userObject = await this.usersRepository.findById(id);

      if (userObject && userObject?.password !== updateUserDto.password) {
        const salt = await bcrypt.genSalt();
        password = await bcrypt.hash(updateUserDto.password, salt);
      }
    }

    let email: string | null | undefined = undefined;

    if (updateUserDto.email) {
      const userObject = await this.usersRepository.findByEmail(
        updateUserDto.email,
      );

      if (userObject && userObject.id !== id) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailAlreadyExists',
          },
        });
      }

      email = updateUserDto.email;
    } else if (updateUserDto.email === null) {
      email = null;
    }

    let photo: FileType | null | undefined = undefined;

    if (updateUserDto.photo?.id) {
      const fileObject = await this.filesService.findById(
        updateUserDto.photo.id,
      );
      if (!fileObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            photo: 'imageNotExists',
          },
        });
      }
      photo = fileObject;
    } else if (updateUserDto.photo === null) {
      photo = null;
    }

    let role: Role | undefined = undefined;

    if (updateUserDto.role?.id) {
      const roleObject = Object.values(RoleEnum)
        .map(String)
        .includes(String(updateUserDto.role.id));
      if (!roleObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'roleNotExists',
          },
        });
      }

      role = {
        id: updateUserDto.role.id,
      };
    }

    let status: Status | undefined = undefined;

    if (updateUserDto.status?.id) {
      const statusObject = Object.values(StatusEnum)
        .map(String)
        .includes(String(updateUserDto.status.id));
      if (!statusObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            status: 'statusNotExists',
          },
        });
      }

      status = {
        id: updateUserDto.status.id,
      };
    }

    return this.usersRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      logs,

      mainWallets,

      permissions,

      phone: updateUserDto.phone,

      devices,

      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
      email,
      password,
      photo,
      role,
      status,
      provider: updateUserDto.provider,
      socialId: updateUserDto.socialId,
    });
  }

  async remove(id: User['id']): Promise<void> {
    await this.usersRepository.remove(id);
  }
}
