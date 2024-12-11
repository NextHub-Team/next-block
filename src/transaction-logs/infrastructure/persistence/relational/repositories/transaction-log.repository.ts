import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { TransactionLogEntity } from '../entities/transaction-log.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { TransactionLog } from '../../../../domain/transaction-log';
import { TransactionLogRepository } from '../../transaction-log.repository';
import { TransactionLogMapper } from '../mappers/transaction-log.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class TransactionLogRelationalRepository
  implements TransactionLogRepository
{
  constructor(
    @InjectRepository(TransactionLogEntity)
    private readonly transactionLogRepository: Repository<TransactionLogEntity>,
  ) {}

  async create(data: TransactionLog): Promise<TransactionLog> {
    const persistenceModel = TransactionLogMapper.toPersistence(data);
    const newEntity = await this.transactionLogRepository.save(
      this.transactionLogRepository.create(persistenceModel),
    );
    return TransactionLogMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<TransactionLog[]> {
    const entities = await this.transactionLogRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => TransactionLogMapper.toDomain(entity));
  }

  async findById(
    id: TransactionLog['id'],
  ): Promise<NullableType<TransactionLog>> {
    const entity = await this.transactionLogRepository.findOne({
      where: { id },
    });

    return entity ? TransactionLogMapper.toDomain(entity) : null;
  }

  async findByIds(ids: TransactionLog['id'][]): Promise<TransactionLog[]> {
    const entities = await this.transactionLogRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => TransactionLogMapper.toDomain(entity));
  }

  async update(
    id: TransactionLog['id'],
    payload: Partial<TransactionLog>,
  ): Promise<TransactionLog> {
    const entity = await this.transactionLogRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.transactionLogRepository.save(
      this.transactionLogRepository.create(
        TransactionLogMapper.toPersistence({
          ...TransactionLogMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return TransactionLogMapper.toDomain(updatedEntity);
  }

  async remove(id: TransactionLog['id']): Promise<void> {
    await this.transactionLogRepository.delete(id);
  }
}
