import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateSleevesDto } from './dto/create-sleeves.dto';
import { UpdateSleevesDto } from './dto/update-sleeves.dto';
import { SleevesRepository } from './infrastructure/persistence/sleeves.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Sleeves } from './domain/sleeves';

@Injectable()
export class SleevesService {
  constructor(
    // Dependencies here
    private readonly sleevesRepository: SleevesRepository,
  ) {}

  async create(createSleevesDto: CreateSleevesDto) {
    // Do not remove comment below.
    // <creating-property />

    return this.sleevesRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      envType: createSleevesDto.envType,

      tag: createSleevesDto.tag,

      chainName: createSleevesDto.chainName,

      name: createSleevesDto.name,

      contractAddress: createSleevesDto.contractAddress,

      sleeveId: createSleevesDto.sleeveId,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.sleevesRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Sleeves['id']) {
    return this.sleevesRepository.findById(id);
  }

  findByIds(ids: Sleeves['id'][]) {
    return this.sleevesRepository.findByIds(ids);
  }

  async update(
    id: Sleeves['id'],

    updateSleevesDto: UpdateSleevesDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.sleevesRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      envType: updateSleevesDto.envType,

      tag: updateSleevesDto.tag,

      chainName: updateSleevesDto.chainName,

      name: updateSleevesDto.name,

      contractAddress: updateSleevesDto.contractAddress,

      sleeveId: updateSleevesDto.sleeveId,
    });
  }

  remove(id: Sleeves['id']) {
    return this.sleevesRepository.remove(id);
  }
}
