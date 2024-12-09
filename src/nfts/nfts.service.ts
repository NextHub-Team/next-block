import { Injectable } from '@nestjs/common';
import { CreateNFTDto } from './dto/create-nft.dto';
import { UpdateNFTDto } from './dto/update-nft.dto';
import { NFTRepository } from './infrastructure/persistence/nft.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { NFT } from './domain/nft';

@Injectable()
export class NFTsService {
  constructor(
    // Dependencies here
    private readonly nFTRepository: NFTRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createNFTDto: CreateNFTDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.nFTRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.nFTRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: NFT['id']) {
    return this.nFTRepository.findById(id);
  }

  findByIds(ids: NFT['id'][]) {
    return this.nFTRepository.findByIds(ids);
  }

  async update(
    id: NFT['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateNFTDto: UpdateNFTDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.nFTRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: NFT['id']) {
    return this.nFTRepository.remove(id);
  }
}
