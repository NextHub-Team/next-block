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
import { AccountStatus, KycStatus } from './types/account-enum.type';

@Injectable()
export class AccountsService {
  constructor(
    private readonly userService: UsersService,

    // Dependencies here
    private readonly accountRepository: AccountRepository,
  ) {}

  async create(createAccountDto: CreateAccountDto) {
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

    return this.accountRepository.create({
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
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.accountRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Account['id']) {
    return this.accountRepository.findById(id);
  }

  findByIds(ids: Account['id'][]) {
    return this.accountRepository.findByIds(ids);
  }

  async update(
    id: Account['id'],

    updateAccountDto: UpdateAccountDto,
  ) {
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

    return this.accountRepository.update(id, {
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
  }

  remove(id: Account['id']) {
    return this.accountRepository.remove(id);
  }
}
