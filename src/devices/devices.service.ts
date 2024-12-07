import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import {
  forwardRef,
  HttpStatus,
  Inject,
  UnprocessableEntityException,
} from '@nestjs/common';

import { Injectable } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { DeviceRepository } from './infrastructure/persistence/device.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Device } from './domain/device';

@Injectable()
export class DevicesService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

    // Dependencies here
    private readonly deviceRepository: DeviceRepository,
  ) {}

  async create(createDeviceDto: CreateDeviceDto) {
    // Do not remove comment below.
    // <creating-property />

    const userObject = await this.userService.findById(createDeviceDto.user.id);
    if (!userObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          user: 'notExists',
        },
      });
    }
    const user = userObject;

    return this.deviceRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      name: createDeviceDto.name,

      physicalId: createDeviceDto.physicalId,

      type: createDeviceDto.type,

      token: createDeviceDto.token,

      user,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.deviceRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Device['id']) {
    return this.deviceRepository.findById(id);
  }

  findByIds(ids: Device['id'][]) {
    return this.deviceRepository.findByIds(ids);
  }

  async update(
    id: Device['id'],

    updateDeviceDto: UpdateDeviceDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    let user: User | undefined = undefined;

    if (updateDeviceDto.user) {
      const userObject = await this.userService.findById(
        updateDeviceDto.user.id,
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

    return this.deviceRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      name: updateDeviceDto.name,

      physicalId: updateDeviceDto.physicalId,

      type: updateDeviceDto.type,

      token: updateDeviceDto.token,

      user,
    });
  }

  remove(id: Device['id']) {
    return this.deviceRepository.remove(id);
  }
}
