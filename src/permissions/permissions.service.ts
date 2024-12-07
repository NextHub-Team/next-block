import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import {
  forwardRef,
  HttpStatus,
  Inject,
  UnprocessableEntityException,
} from '@nestjs/common';

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

  async create(createPermissionDto: CreatePermissionDto) {
    // Do not remove comment below.
    // <creating-property />
    const userObject = await this.userService.findById(
      createPermissionDto.user.id,
    );
    if (!userObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          user: 'notExists',
        },
      });
    }
    const user = userObject;

    return this.permissionRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      user,
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

  async update(
    id: Permission['id'],

    updatePermissionDto: UpdatePermissionDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let user: User | undefined = undefined;

    if (updatePermissionDto.user) {
      const userObject = await this.userService.findById(
        updatePermissionDto.user.id,
      );
      if (!userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            user: 'notExists',
          },
        });
      }
      user = userObject;
    }

    return this.permissionRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      user,
    });
  }

  remove(id: Permission['id']) {
    return this.permissionRepository.remove(id);
  }
}
