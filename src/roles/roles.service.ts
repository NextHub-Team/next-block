import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleRepository } from './infrastructure/persistence/role.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Role } from './domain/role';

@Injectable()
export class RolesService {
  constructor(
    // Dependencies here
    private readonly roleRepository: RoleRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createRoleDto: CreateRoleDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.roleRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.roleRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Role['id']) {
    return this.roleRepository.findById(id);
  }

  findByIds(ids: Role['id'][]) {
    return this.roleRepository.findByIds(ids);
  }

  async update(
    id: Role['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateRoleDto: UpdateRoleDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.roleRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: Role['id']) {
    return this.roleRepository.remove(id);
  }
}
