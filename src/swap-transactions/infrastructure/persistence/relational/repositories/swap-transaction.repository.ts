import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { SwapTransactionEntity } from '../entities/swap-transaction.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { SwapTransaction } from '../../../../domain/swap-transaction';
import { SwapTransactionRepository } from '../../swap-transaction.repository';
import { SwapTransactionMapper } from '../mappers/swap-transaction.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class SwapTransactionRelationalRepository
  implements SwapTransactionRepository
{
  constructor(
    @InjectRepository(SwapTransactionEntity)
    private readonly swapTransactionRepository: Repository<SwapTransactionEntity>,
  ) {}

  async create(data: SwapTransaction): Promise<SwapTransaction> {
    const persistenceModel = SwapTransactionMapper.toPersistence(data);
    const newEntity = await this.swapTransactionRepository.save(
      this.swapTransactionRepository.create(persistenceModel),
    );
    return SwapTransactionMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<SwapTransaction[]> {
    const entities = await this.swapTransactionRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => SwapTransactionMapper.toDomain(entity));
  }

  async findById(
    id: SwapTransaction['id'],
  ): Promise<NullableType<SwapTransaction>> {
    const entity = await this.swapTransactionRepository.findOne({
      where: { id },
    });

    return entity ? SwapTransactionMapper.toDomain(entity) : null;
  }

  async findByIds(ids: SwapTransaction['id'][]): Promise<SwapTransaction[]> {
    const entities = await this.swapTransactionRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => SwapTransactionMapper.toDomain(entity));
  }

  async update(
    id: SwapTransaction['id'],
    payload: Partial<SwapTransaction>,
  ): Promise<SwapTransaction> {
    const entity = await this.swapTransactionRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.swapTransactionRepository.save(
      this.swapTransactionRepository.create(
        SwapTransactionMapper.toPersistence({
          ...SwapTransactionMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return SwapTransactionMapper.toDomain(updatedEntity);
  }

  async remove(id: SwapTransaction['id']): Promise<void> {
    await this.swapTransactionRepository.delete(id);
  }
}
