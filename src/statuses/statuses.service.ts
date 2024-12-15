import { Injectable } from '@nestjs/common';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { StatusRepository } from './infrastructure/persistence/status.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Status } from './domain/status';

@Injectable()
export class StatusesService {
  constructor(
    // Dependencies here
    private readonly statusRepository: StatusRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createStatusDto: CreateStatusDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.statusRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.statusRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Status['id']) {
    return this.statusRepository.findById(id);
  }

  findByIds(ids: Status['id'][]) {
    return this.statusRepository.findByIds(ids);
  }

  async update(
    id: Status['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateStatusDto: UpdateStatusDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.statusRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: Status['id']) {
    return this.statusRepository.remove(id);
  }
}
