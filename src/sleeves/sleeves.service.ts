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

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createSleevesDto: CreateSleevesDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.sleevesRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateSleevesDto: UpdateSleevesDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.sleevesRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: Sleeves['id']) {
    return this.sleevesRepository.remove(id);
  }
}
