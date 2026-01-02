import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateSleevesTransactionDto } from './dto/create-sleeves-transaction.dto';
import { UpdateSleevesTransactionDto } from './dto/update-sleeves-transaction.dto';
import { SleevesTransactionRepository } from './infrastructure/persistence/sleeves-transaction.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { SleevesTransaction } from './domain/sleeves-transaction';

@Injectable()
export class SleevesTransactionsService {
  constructor(
    // Dependencies here
    private readonly sleevesTransactionRepository: SleevesTransactionRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createSleevesTransactionDto: CreateSleevesTransactionDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.sleevesTransactionRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.sleevesTransactionRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: SleevesTransaction['id']) {
    return this.sleevesTransactionRepository.findById(id);
  }

  findByIds(ids: SleevesTransaction['id'][]) {
    return this.sleevesTransactionRepository.findByIds(ids);
  }

  async update(
    id: SleevesTransaction['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateSleevesTransactionDto: UpdateSleevesTransactionDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.sleevesTransactionRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: SleevesTransaction['id']) {
    return this.sleevesTransactionRepository.remove(id);
  }
}
