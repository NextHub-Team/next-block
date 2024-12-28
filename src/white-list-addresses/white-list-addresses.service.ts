import { Injectable } from '@nestjs/common';
import { CreateWhiteListAddressDto } from './dto/create-white-list-address.dto';
import { UpdateWhiteListAddressDto } from './dto/update-white-list-address.dto';
import { WhiteListAddressRepository } from './infrastructure/persistence/white-list-address.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { WhiteListAddress } from './domain/white-list-address';

@Injectable()
export class WhiteListAddressesService {
  constructor(
    // Dependencies here
    private readonly whiteListAddressRepository: WhiteListAddressRepository,
  ) {}

  async create(createWhiteListAddressDto: CreateWhiteListAddressDto) {
    // Do not remove comment below.
    // <creating-property />

    return this.whiteListAddressRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      label: createWhiteListAddressDto.label,

      description: createWhiteListAddressDto.description,

      address: createWhiteListAddressDto.address,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.whiteListAddressRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: WhiteListAddress['id']) {
    return this.whiteListAddressRepository.findById(id);
  }

  findByIds(ids: WhiteListAddress['id'][]) {
    return this.whiteListAddressRepository.findByIds(ids);
  }

  async update(
    id: WhiteListAddress['id'],

    updateWhiteListAddressDto: UpdateWhiteListAddressDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.whiteListAddressRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      label: updateWhiteListAddressDto.label,

      description: updateWhiteListAddressDto.description,

      address: updateWhiteListAddressDto.address,
    });
  }

  remove(id: WhiteListAddress['id']) {
    return this.whiteListAddressRepository.remove(id);
  }
}
