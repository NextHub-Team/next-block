import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { InternalEventEntity } from '../entities/internal-event.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InternalEvent } from '../../../../domain/internal-event';
import { InternalEventRepository } from '../../internal-event.repository';
import { InternalEventMapper } from '../mappers/internal-event.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { DeepPartial } from '../../../../../utils/types/deep-partial.type';
import { LoggerService } from '../../../../../common/logger/logger.service';

@Injectable()
export class InternalEventRelationalRepository
  implements InternalEventRepository
{
  constructor(
    @InjectRepository(InternalEventEntity)
    private readonly internalEventRepository: Repository<InternalEventEntity>,
    private readonly loggerService: LoggerService,
  ) {}

  async create(data: InternalEvent): Promise<InternalEvent> {
    const persistenceModel = InternalEventMapper.toPersistence(data);
    const newEntity = await this.internalEventRepository.save(
      this.internalEventRepository.create(persistenceModel),
    );
    this.loggerService.debug(
      `Persisted internal event id=${newEntity.id} type=${newEntity.eventType}`,
      InternalEventRelationalRepository.name,
    );
    return InternalEventMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<InternalEvent[]> {
    this.loggerService.debug(
      `Fetching internal events page=${paginationOptions.page} limit=${paginationOptions.limit}`,
      InternalEventRelationalRepository.name,
    );
    const entities = await this.internalEventRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => InternalEventMapper.toDomain(entity));
  }

  async findById(
    id: InternalEvent['id'],
  ): Promise<NullableType<InternalEvent>> {
    this.loggerService.debug(
      `Fetching internal event id=${id}`,
      InternalEventRelationalRepository.name,
    );
    const entity = await this.internalEventRepository.findOne({
      where: { id },
    });

    return entity ? InternalEventMapper.toDomain(entity) : null;
  }

  async findByIds(ids: InternalEvent['id'][]): Promise<InternalEvent[]> {
    this.loggerService.debug(
      `Fetching internal events ids=${ids.join(',')}`,
      InternalEventRelationalRepository.name,
    );
    const entities = await this.internalEventRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => InternalEventMapper.toDomain(entity));
  }

  async update(
    id: InternalEvent['id'],
    payload: DeepPartial<InternalEvent>,
  ): Promise<InternalEvent | null> {
    const entity = await this.internalEventRepository.findOne({
      where: { id },
    });

    if (!entity) {
      this.loggerService.warn(
        `Internal event id=${id} not found for update`,
        InternalEventRelationalRepository.name,
      );
      return null;
    }

    const currentDomain = InternalEventMapper.toDomain(entity);
    const merged: InternalEvent = {
      ...currentDomain,
      ...payload,
      payload: (payload.payload ??
        currentDomain.payload) as InternalEvent['payload'],
      publishedAt:
        (payload.publishedAt as Date | null | undefined) ??
        currentDomain.publishedAt,
      occurredAt:
        (payload.occurredAt as Date | undefined) ?? currentDomain.occurredAt,
      createdAt: (payload.createdAt as Date) ?? currentDomain.createdAt,
      updatedAt: (payload.updatedAt as Date) ?? currentDomain.updatedAt,
    };

    const updatedEntity = await this.internalEventRepository.save(
      this.internalEventRepository.create(
        InternalEventMapper.toPersistence(merged),
      ),
    );

    this.loggerService.log(
      `Updated internal event id=${id}`,
      InternalEventRelationalRepository.name,
    );

    return InternalEventMapper.toDomain(updatedEntity);
  }

  async remove(id: InternalEvent['id']): Promise<void> {
    await this.internalEventRepository.delete(id);
    this.loggerService.warn(
      `Deleted internal event id=${id}`,
      InternalEventRelationalRepository.name,
    );
  }
}
