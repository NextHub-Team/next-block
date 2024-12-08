import { Injectable } from '@nestjs/common';
import { CreatePassphraseDto } from './dto/create-passphrase.dto';
import { UpdatePassphraseDto } from './dto/update-passphrase.dto';
import { PassphraseRepository } from './infrastructure/persistence/passphrase.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Passphrase } from './domain/passphrase';

@Injectable()
export class PassphrasesService {
  constructor(
    // Dependencies here
    private readonly passphraseRepository: PassphraseRepository,
  ) {}

  async create(createPassphraseDto: CreatePassphraseDto) {
    // Do not remove comment below.
    // <creating-property />

    return this.passphraseRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      location: createPassphraseDto.location,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.passphraseRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Passphrase['id']) {
    return this.passphraseRepository.findById(id);
  }

  findByIds(ids: Passphrase['id'][]) {
    return this.passphraseRepository.findByIds(ids);
  }

  async update(
    id: Passphrase['id'],

    updatePassphraseDto: UpdatePassphraseDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.passphraseRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      location: updatePassphraseDto.location,
    });
  }

  remove(id: Passphrase['id']) {
    return this.passphraseRepository.remove(id);
  }
}
