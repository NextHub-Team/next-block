import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { EventLogEntity } from '../entities/event-log.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { EventLog } from '../../../../domain/event-log';
import { EventLogRepository } from '../../event-log.repository';
import { EventLogMapper } from '../mappers/event-log.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class EventLogRelationalRepository implements EventLogRepository {
  constructor(
    @InjectRepository(EventLogEntity)
    private readonly eventLogRepository: Repository<EventLogEntity>,
  ) {}

  async create(data: EventLog): Promise<EventLog> {
    const persistenceModel = EventLogMapper.toPersistence(data);
    const newEntity = await this.eventLogRepository.save(
      this.eventLogRepository.create(persistenceModel),
    );
    return EventLogMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<EventLog[]> {
    const entities = await this.eventLogRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => EventLogMapper.toDomain(entity));
  }

  async findById(id: EventLog['id']): Promise<NullableType<EventLog>> {
    const entity = await this.eventLogRepository.findOne({
      where: { id },
    });

    return entity ? EventLogMapper.toDomain(entity) : null;
  }

  async findByIds(ids: EventLog['id'][]): Promise<EventLog[]> {
    const entities = await this.eventLogRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => EventLogMapper.toDomain(entity));
  }

  async update(
    id: EventLog['id'],
    payload: Partial<EventLog>,
  ): Promise<EventLog> {
    const entity = await this.eventLogRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.eventLogRepository.save(
      this.eventLogRepository.create(
        EventLogMapper.toPersistence({
          ...EventLogMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return EventLogMapper.toDomain(updatedEntity);
  }

  async remove(id: EventLog['id']): Promise<void> {
    await this.eventLogRepository.delete(id);
  }
}
