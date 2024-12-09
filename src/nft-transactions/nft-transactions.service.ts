import { Injectable } from '@nestjs/common';
import { CreateNftTransactionDto } from './dto/create-nft-transaction.dto';
import { UpdateNftTransactionDto } from './dto/update-nft-transaction.dto';
import { NftTransactionRepository } from './infrastructure/persistence/nft-transaction.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { NftTransaction } from './domain/nft-transaction';

@Injectable()
export class NftTransactionsService {
  constructor(
    // Dependencies here
    private readonly nftTransactionRepository: NftTransactionRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createNftTransactionDto: CreateNftTransactionDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.nftTransactionRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateNftTransactionDto: UpdateNftTransactionDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.nftTransactionRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: NftTransaction['id']) {
    return this.nftTransactionRepository.remove(id);
  }
}
