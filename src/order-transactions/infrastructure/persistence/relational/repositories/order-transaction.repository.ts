import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { OrderTransactionEntity } from '../entities/order-transaction.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { OrderTransaction } from '../../../../domain/order-transaction';
import { OrderTransactionRepository } from '../../order-transaction.repository';
import { OrderTransactionMapper } from '../mappers/order-transaction.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class OrderTransactionRelationalRepository
  implements OrderTransactionRepository
{
  constructor(
    @InjectRepository(OrderTransactionEntity)
    private readonly orderTransactionRepository: Repository<OrderTransactionEntity>,
  ) {}

  async create(data: OrderTransaction): Promise<OrderTransaction> {
    const persistenceModel = OrderTransactionMapper.toPersistence(data);
    const newEntity = await this.orderTransactionRepository.save(
      this.orderTransactionRepository.create(persistenceModel),
    );
    return OrderTransactionMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<OrderTransaction[]> {
    const entities = await this.orderTransactionRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => OrderTransactionMapper.toDomain(entity));
  }

  async findById(
    id: OrderTransaction['id'],
  ): Promise<NullableType<OrderTransaction>> {
    const entity = await this.orderTransactionRepository.findOne({
      where: { id },
    });

    return entity ? OrderTransactionMapper.toDomain(entity) : null;
  }

  async findByIds(ids: OrderTransaction['id'][]): Promise<OrderTransaction[]> {
    const entities = await this.orderTransactionRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => OrderTransactionMapper.toDomain(entity));
  }

  async update(
    id: OrderTransaction['id'],
    payload: Partial<OrderTransaction>,
  ): Promise<OrderTransaction> {
    const entity = await this.orderTransactionRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.orderTransactionRepository.save(
      this.orderTransactionRepository.create(
        OrderTransactionMapper.toPersistence({
          ...OrderTransactionMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return OrderTransactionMapper.toDomain(updatedEntity);
  }

  async remove(id: OrderTransaction['id']): Promise<void> {
    await this.orderTransactionRepository.delete(id);
  }
}
