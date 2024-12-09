import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import {
  forwardRef,
  HttpStatus,
  Inject,
  UnprocessableEntityException,
} from '@nestjs/common';

import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionRepository } from './infrastructure/persistence/transaction.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Transaction } from './domain/transaction';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

    // Dependencies here
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    // Do not remove comment below.
    // <creating-property />
    const userObject = await this.userService.findById(
      createTransactionDto.user.id,
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

    return this.transactionRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      user,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.transactionRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Transaction['id']) {
    return this.transactionRepository.findById(id);
  }

  findByIds(ids: Transaction['id'][]) {
    return this.transactionRepository.findByIds(ids);
  }

  async update(
    id: Transaction['id'],

    updateTransactionDto: UpdateTransactionDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let user: User | undefined = undefined;

    if (updateTransactionDto.user) {
      const userObject = await this.userService.findById(
        updateTransactionDto.user.id,
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

    return this.transactionRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      user,
    });
  }

  remove(id: Transaction['id']) {
    return this.transactionRepository.remove(id);
  }
}
