import { Injectable } from '@nestjs/common';
import { CreateEventLogDto } from './dto/create-event-log.dto';
import { UpdateEventLogDto } from './dto/update-event-log.dto';
import { EventLogRepository } from './infrastructure/persistence/event-log.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { EventLog } from './domain/event-log';

@Injectable()
export class EventLogsService {
  constructor(
    // Dependencies here
    private readonly eventLogRepository: EventLogRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createEventLogDto: CreateEventLogDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.eventLogRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.eventLogRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: EventLog['id']) {
    return this.eventLogRepository.findById(id);
  }

  findByIds(ids: EventLog['id'][]) {
    return this.eventLogRepository.findByIds(ids);
  }

  async update(
    id: EventLog['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateEventLogDto: UpdateEventLogDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.eventLogRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: EventLog['id']) {
    return this.eventLogRepository.remove(id);
  }
}
