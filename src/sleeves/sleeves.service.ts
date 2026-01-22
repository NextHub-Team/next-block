import { AssetRegistriesService } from '../asset-registries/asset-registries.service';
import { AssetRegistry } from '../asset-registries/domain/asset-registry';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateSleevesDto } from './dto/create-sleeves.dto';
import { UpdateSleevesDto } from './dto/update-sleeves.dto';
import { SleevesRepository } from './infrastructure/persistence/sleeves.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Sleeves } from './domain/sleeves';
import { FilterSleevesDto } from './dto/filter-sleeves.dto';
import { SleevesDto } from './dto/sleeves.dto';

@Injectable()
export class SleevesService {
  constructor(
    private readonly assetRegistryService: AssetRegistriesService,

    // Dependencies here
    private readonly sleevesRepository: SleevesRepository,
  ) {}

  async create(createSleevesDto: CreateSleevesDto) {
    // Do not remove comment below.
    // <creating-property />

    const assetObject = await this.assetRegistryService.findById(
      createSleevesDto.asset.id,
    );
    if (!assetObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          asset: 'notExists',
        },
      });
    }
    const asset = assetObject;

    return this.sleevesRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      contractName: createSleevesDto.contractName,

      contractAddress: createSleevesDto.contractAddress,

      asset,

      tag: createSleevesDto.tag,

      name: createSleevesDto.name,

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

    let asset: AssetRegistry | undefined = undefined;

    if (updateSleevesDto.asset) {
      const assetObject = await this.assetRegistryService.findById(
        updateSleevesDto.asset.id,
      );
      if (!assetObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            asset: 'notExists',
          },
        });
      }
      asset = assetObject;
    }

    return this.sleevesRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      contractName: updateSleevesDto.contractName,

      contractAddress: updateSleevesDto.contractAddress,

      asset,

      tag: updateSleevesDto.tag,

      name: updateSleevesDto.name,

      sleeveId: updateSleevesDto.sleeveId,
    });
  }

  remove(id: Sleeves['id']) {
    return this.sleevesRepository.remove(id);
  }

  async filter(filters: FilterSleevesDto): Promise<SleevesDto[]> {
    return await this.sleevesRepository.filter(
      filters.contractName,
      filters.tag,
      filters.name,
    );
  }

  async findBySleeveId(sleeveId: Sleeves['sleeveId']) {
    return this.sleevesRepository.findBySleeveId(sleeveId);
  }
  async findByAsset(assetId: string): Promise<SleevesDto[]> {
    const assetObject = await this.assetRegistryService.findByAssetId(assetId);
    if (!assetObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          asset: 'notExists',
        },
      });
    }
    const asset = assetObject;
    return await this.sleevesRepository.findAllByAsset(asset);
  }
}
