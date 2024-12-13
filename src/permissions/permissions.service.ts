import { UsersService } from '../users/users.service';

import { forwardRef, Inject } from '@nestjs/common';

import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionRepository } from './infrastructure/persistence/permission.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Permission } from './domain/permission';

@Injectable()
export class PermissionsService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    // Dependencies here
    private readonly permissionRepository: PermissionRepository,
  ) {}
  /* eslint-disable @typescript-eslint/no-unused-vars */
  async create(createPermissionDto: CreatePermissionDto) {
    // Do not remove comment below.
    // <creating-property />

    return this.permissionRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.permissionRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Permission['id']) {
    return this.permissionRepository.findById(id);
  }

  findByIds(ids: Permission['id'][]) {
    return this.permissionRepository.findByIds(ids);
  }
  /* eslint-disable @typescript-eslint/no-unused-vars */
  async update(id: Permission['id'], updatePermissionDto: UpdatePermissionDto) {
    // Do not remove comment below.
    // <updating-property />

    return this.permissionRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: Permission['id']) {
    return this.permissionRepository.remove(id);
  }
}
