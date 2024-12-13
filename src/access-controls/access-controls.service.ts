import { Injectable } from '@nestjs/common';
import { CreateAccessControlDto } from './dto/create-access-control.dto';
import { UpdateAccessControlDto } from './dto/update-access-control.dto';
import { AccessControlRepository } from './infrastructure/persistence/access-control.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { AccessControl } from './domain/access-control';

@Injectable()
export class AccessControlsService {
  constructor(
    // Dependencies here
    private readonly accessControlRepository: AccessControlRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createAccessControlDto: CreateAccessControlDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.accessControlRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.accessControlRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: AccessControl['id']) {
    return this.accessControlRepository.findById(id);
  }

  findByIds(ids: AccessControl['id'][]) {
    return this.accessControlRepository.findByIds(ids);
  }

  async update(
    id: AccessControl['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateAccessControlDto: UpdateAccessControlDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.accessControlRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: AccessControl['id']) {
    return this.accessControlRepository.remove(id);
  }
}
