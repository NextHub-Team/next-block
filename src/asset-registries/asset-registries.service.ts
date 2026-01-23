import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateAssetRegistryDto } from './dto/create-asset-registry.dto';
import { UpdateAssetRegistryDto } from './dto/update-asset-registry.dto';
import { AssetRegistryRepository } from './infrastructure/persistence/asset-registry.repository';
import { IPaginationOptions } from '../utils/types/pagination-options.type';
import { AssetRegistry } from './domain/asset-registry';

@Injectable()
export class AssetRegistriesService {
  constructor(
    // Dependencies here
    private readonly assetRegistryRepository: AssetRegistryRepository,
  ) {}

  async create(createAssetRegistryDto: CreateAssetRegistryDto) {
    // Do not remove comment below.
    // <creating-property />

    return await this.assetRegistryRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      description: createAssetRegistryDto.description,

      providerName: createAssetRegistryDto.providerName,

      envType: createAssetRegistryDto.envType,

      chainName: createAssetRegistryDto.chainName,

      assetId: createAssetRegistryDto.assetId,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.assetRegistryRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: AssetRegistry['id']) {
    return this.assetRegistryRepository.findById(id);
  }

  findByIds(ids: AssetRegistry['id'][]) {
    return this.assetRegistryRepository.findByIds(ids);
  }
  async findByProviderName(
    providerName: AssetRegistry['providerName'],
  ): Promise<AssetRegistry[]> {
    return await this.assetRegistryRepository.findByProviderName(providerName);
  }

  async update(
    id: AssetRegistry['id'],

    updateAssetRegistryDto: UpdateAssetRegistryDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.assetRegistryRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      description: updateAssetRegistryDto.description,

      providerName: updateAssetRegistryDto.providerName,

      envType: updateAssetRegistryDto.envType,

      chainName: updateAssetRegistryDto.chainName,

      assetId: updateAssetRegistryDto.assetId,
    });
  }

  remove(id: AssetRegistry['id']) {
    return this.assetRegistryRepository.remove(id);
  }
  findByAssetId(id: AssetRegistry['assetId']) {
    return this.assetRegistryRepository.findByAssetId(id);
  }
}
