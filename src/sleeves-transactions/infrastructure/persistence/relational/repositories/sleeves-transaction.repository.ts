import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { SleevesTransactionEntity } from '../entities/sleeves-transaction.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { SleevesTransaction } from '../../../../domain/sleeves-transaction';
import { SleevesTransactionRepository } from '../../sleeves-transaction.repository';
import { SleevesTransactionMapper } from '../mappers/sleeves-transaction.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class SleevesTransactionRelationalRepository
  implements SleevesTransactionRepository
{
  constructor(
    @InjectRepository(SleevesTransactionEntity)
    private readonly sleevesTransactionRepository: Repository<SleevesTransactionEntity>,
  ) {}

  async create(data: SleevesTransaction): Promise<SleevesTransaction> {
    const persistenceModel = SleevesTransactionMapper.toPersistence(data);
    const newEntity = await this.sleevesTransactionRepository.save(
      this.sleevesTransactionRepository.create(persistenceModel),
    );
    return SleevesTransactionMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<SleevesTransaction[]> {
    const entities = await this.sleevesTransactionRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => SleevesTransactionMapper.toDomain(entity));
  }

  async findById(
    id: SleevesTransaction['id'],
  ): Promise<NullableType<SleevesTransaction>> {
    const entity = await this.sleevesTransactionRepository.findOne({
      where: { id },
    });

    return entity ? SleevesTransactionMapper.toDomain(entity) : null;
  }

  async findByIds(
    ids: SleevesTransaction['id'][],
  ): Promise<SleevesTransaction[]> {
    const entities = await this.sleevesTransactionRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => SleevesTransactionMapper.toDomain(entity));
  }

  async update(
    id: SleevesTransaction['id'],
    payload: Partial<SleevesTransaction>,
  ): Promise<SleevesTransaction> {
    const entity = await this.sleevesTransactionRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.sleevesTransactionRepository.save(
      this.sleevesTransactionRepository.create(
        SleevesTransactionMapper.toPersistence({
          ...SleevesTransactionMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return SleevesTransactionMapper.toDomain(updatedEntity);
  }

  async remove(id: SleevesTransaction['id']): Promise<void> {
    await this.sleevesTransactionRepository.delete(id);
  }
}
