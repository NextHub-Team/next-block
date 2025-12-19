import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountRepository } from './infrastructure/persistence/account.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Account } from './domain/account';
import {
  AccountProviderName,
  AccountStatus,
  KycStatus,
} from './types/account-enum.type';
import { NullableType } from '../utils/types/nullable.type';
import { AccountDto } from './dto/account.dto';
import { RoleEnum } from '../roles/roles.enum';
import {
  GroupPlainToInstance,
  GroupPlainToInstances,
} from '../utils/transformers/class.transformer';

@Injectable()
export class AccountsService {
  constructor(
    private readonly userService: UsersService,

    // Dependencies here
    private readonly accountRepository: AccountRepository,
  ) {}

  async upsertByProviderAccountId(payload: {
    providerAccountId: Account['providerAccountId'];
    providerName: AccountProviderName;
    user: { id: User['id'] };
    KycStatus?: KycStatus;
    label?: Account['label'];
    metadata?: Account['metadata'];
    status?: AccountStatus;
  }): Promise<AccountDto> {
    const existing = await this.accountRepository.findByProviderAccountId(
      payload.providerAccountId,
    );

    if (existing) {
      const updated = await this.update(existing.id, {
        KycStatus: payload.KycStatus ?? existing.KycStatus,
        label: payload.label ?? existing.label,
        metadata: payload.metadata ?? existing.metadata,
        status: payload.status ?? existing.status,
        providerAccountId: payload.providerAccountId,
        providerName: payload.providerName ?? existing.providerName,
        user:
          payload.user ??
          (existing.user?.id ? { id: existing.user.id } : undefined),
      });

      if (!updated) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            account: 'notExists',
          },
        });
      }

      return updated;
    }

    return this.create({
      user: payload.user,
      KycStatus: payload.KycStatus,
      label: payload.label,
      metadata: payload.metadata,
      status: payload.status,
      providerAccountId: payload.providerAccountId,
      providerName: payload.providerName,
    });
  }

  async create(createAccountDto: CreateAccountDto): Promise<AccountDto> {
    // Do not remove comment below.
    // <creating-property />

    const userObject = await this.userService.findById(
      createAccountDto.user.id,
    );
    if (!userObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          user: 'notExists',
        },
      });
    }
    const user = userObject;

    const account = await this.accountRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      KycStatus: createAccountDto.KycStatus ?? KycStatus.PENDING,

      label: createAccountDto.label,

      metadata: createAccountDto.metadata,

      status: createAccountDto.status ?? AccountStatus.ACTIVE,

      providerAccountId: createAccountDto.providerAccountId,

      providerName: createAccountDto.providerName,

      user,
    });

    return GroupPlainToInstance(AccountDto, account, [RoleEnum.admin]);
  }

  async createBulk(
    createAccountDtos: CreateAccountDto[],
  ): Promise<AccountDto[]> {
    if (!createAccountDtos?.length) {
      return [];
    }

    const userIds = Array.from(
      new Set(
        createAccountDtos
          .map((dto) => dto.user?.id)
          .filter(
            (id): id is User['id'] => typeof id !== 'undefined' && id !== null,
          ),
      ),
    );
    const normalizedUserIds = userIds
      .map((id) => Number(id))
      .filter((id) => !Number.isNaN(id));
    const users = await this.userService.findByIds(normalizedUserIds);
    const usersById = new Map(users.map((user) => [user.id, user]));
    const missingUserId = userIds.find((id) => !usersById.has(Number(id)));

    if (typeof missingUserId !== 'undefined') {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          user: 'notExists',
        },
      });
    }

    const accounts = await this.accountRepository.createMany(
      createAccountDtos.map((dto) => ({
        KycStatus: dto.KycStatus ?? KycStatus.PENDING,

        label: dto.label,

        metadata: dto.metadata,

        status: dto.status ?? AccountStatus.ACTIVE,

        providerAccountId: dto.providerAccountId,

        providerName: dto.providerName,

        user: usersById.get(Number(dto.user.id)) as User,
      })),
    );

    return GroupPlainToInstances(AccountDto, accounts, [RoleEnum.admin]);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<AccountDto[]> {
    const accounts = await this.accountRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });

    return GroupPlainToInstances(AccountDto, accounts, [RoleEnum.admin]);
  }

  async findById(
    id: Account['id'],
    roles: RoleEnum[] = [RoleEnum.admin],
  ): Promise<NullableType<AccountDto>> {
    const account = await this.accountRepository.findById(id);
    if (!account) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          account: 'notExists',
        },
      });
    }
    return GroupPlainToInstance(AccountDto, account, roles);
  }

  async findByMe(
    id: Account['id'],
    userId: User['id'],
  ): Promise<NullableType<AccountDto>> {
    const account = await this.accountRepository.findById(id, userId);
    if (!account) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          account: 'notExists',
        },
      });
    }
    return GroupPlainToInstance(AccountDto, account, [RoleEnum.user]);
  }

  async findByIds(
    ids: Account['id'][],
    roles: RoleEnum[] = [RoleEnum.admin],
  ): Promise<AccountDto[]> {
    const accounts = await this.accountRepository.findByIds(ids);
    return GroupPlainToInstances(AccountDto, accounts, roles);
  }

  async findAllByUserId(
    userId: User['id'],
    roles: RoleEnum[] = [RoleEnum.admin],
  ): Promise<AccountDto[]> {
    const accounts = await this.accountRepository.findAllByUserId(userId);
    return GroupPlainToInstances(AccountDto, accounts, roles);
  }

  async filter(
    userId?: User['id'],
    label?: Account['label'],
    status?: Account['status'],
    providerAccountId?: Account['providerAccountId'],
    roles: RoleEnum[] = [RoleEnum.admin],
  ): Promise<AccountDto[]> {
    const accounts = await this.accountRepository.filter(
      userId,
      label,
      status,
      providerAccountId,
    );
    return GroupPlainToInstances(AccountDto, accounts, roles);
  }

  async findActives(
    userId?: User['id'],
    roles: RoleEnum[] = [RoleEnum.admin],
  ): Promise<AccountDto[]> {
    const accounts = await this.accountRepository.findActives(userId);
    return GroupPlainToInstances(AccountDto, accounts, roles);
  }

  countAll(userId?: User['id']) {
    return this.accountRepository.countAll(userId);
  }

  countActives(userId?: User['id']) {
    return this.accountRepository.countActives(userId);
  }

  async hasCompletedKyc(userId: User['id']): Promise<boolean> {
    const accounts = await this.accountRepository.findAllByUserId(userId);
    return accounts.some((account) => account.KycStatus === KycStatus.VERIFIED);
  }

  async findByAccountId(
    providerAccountId: Account['providerAccountId'],
    roles: RoleEnum[] = [RoleEnum.admin],
  ): Promise<NullableType<AccountDto>> {
    const account =
      await this.accountRepository.findByProviderAccountId(providerAccountId);
    return account ? GroupPlainToInstance(AccountDto, account, roles) : null;
  }

  async findByUserSocialId(
    socialId: User['socialId'],
    roles: RoleEnum[] = [RoleEnum.admin],
  ): Promise<AccountDto[]> {
    const accounts = await this.accountRepository.findByUserSocialId(socialId);
    return GroupPlainToInstances(AccountDto, accounts, roles);
  }

  async findBySocialIdAndProviderName(
    socialId: User['socialId'],
    providerName: Account['providerName'],
    roles: RoleEnum[] = [RoleEnum.admin],
  ): Promise<NullableType<AccountDto>> {
    const account = await this.accountRepository.findBySocialIdAndProviderName(
      socialId,
      providerName,
    );
    return account ? GroupPlainToInstance(AccountDto, account, roles) : null;
  }

  async findByMeAndProviderName(
    userId: User['id'],
    providerName: Account['providerName'],
  ): Promise<NullableType<AccountDto>> {
    const account = await this.accountRepository.findByUserIdAndProviderName(
      userId,
      providerName,
    );
    if (!account) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          account: 'notExists',
        },
      });
    }
    return GroupPlainToInstance(AccountDto, account, [RoleEnum.user]);
  }

  async update(
    id: Account['id'],

    updateAccountDto: UpdateAccountDto,
  ): Promise<NullableType<AccountDto>> {
    // Do not remove comment below.
    // <updating-property />

    let user: User | undefined = undefined;

    if (updateAccountDto.user) {
      const userObject = await this.userService.findById(
        updateAccountDto.user.id,
      );
      if (!userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            user: 'notExists',
          },
        });
      }
      user = userObject;
    }

    const account = await this.accountRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      KycStatus: updateAccountDto.KycStatus,

      label: updateAccountDto.label,

      metadata: updateAccountDto.metadata,

      status: updateAccountDto.status,

      providerAccountId: updateAccountDto.providerAccountId,

      providerName: updateAccountDto.providerName,

      user,
    });

    return account
      ? GroupPlainToInstance(AccountDto, account, [RoleEnum.admin])
      : null;
  }

  remove(id: Account['id']) {
    return this.accountRepository.remove(id);
  }
}
