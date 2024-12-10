import { TransactionsService } from '../transactions/transactions.service';
import { Transaction } from '../transactions/domain/transaction';
import { HttpStatus, UnprocessableEntityException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { CreateNftTransactionDto } from './dto/create-nft-transaction.dto';
import { UpdateNftTransactionDto } from './dto/update-nft-transaction.dto';
import { NftTransactionRepository } from './infrastructure/persistence/nft-transaction.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { NftTransaction } from './domain/nft-transaction';

@Injectable()
export class NftTransactionsService {
  constructor(
    private readonly transactionService: TransactionsService,

    // Dependencies here
    private readonly nftTransactionRepository: NftTransactionRepository,
  ) {}

  async create(createNftTransactionDto: CreateNftTransactionDto) {
    // Do not remove comment below.
    // <creating-property />

    let transaction: Transaction | undefined = undefined;

    if (createNftTransactionDto.transaction) {
      const transactionObject = await this.transactionService.findById(
        createNftTransactionDto.transaction.id,
      );
      if (!transactionObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            transaction: 'notExists',
          },
        });
      }
      transaction = transactionObject;
    }

    return this.nftTransactionRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      transaction,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.nftTransactionRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: NftTransaction['id']) {
    return this.nftTransactionRepository.findById(id);
  }

  findByIds(ids: NftTransaction['id'][]) {
    return this.nftTransactionRepository.findByIds(ids);
  }

  async update(
    id: NftTransaction['id'],

    updateNftTransactionDto: UpdateNftTransactionDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    let transaction: Transaction | undefined = undefined;

    if (updateNftTransactionDto.transaction) {
      const transactionObject = await this.transactionService.findById(
        updateNftTransactionDto.transaction.id,
      );
      if (!transactionObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            transaction: 'notExists',
          },
        });
      }
      transaction = transactionObject;
    }

    return this.nftTransactionRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      transaction,
    });
  }

  remove(id: NftTransaction['id']) {
    return this.nftTransactionRepository.remove(id);
  }
}
