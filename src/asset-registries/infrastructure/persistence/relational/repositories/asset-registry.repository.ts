import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { AssetRegistryEntity } from '../entities/asset-registry.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { AssetRegistry } from '../../../../domain/asset-registry';
import { AssetRegistryRepository } from '../../asset-registry.repository';
import { AssetRegistryMapper } from '../mappers/asset-registry.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class AssetRegistryRelationalRepository
  implements AssetRegistryRepository
{
  constructor(
    @InjectRepository(AssetRegistryEntity)
    private readonly assetRegistryRepository: Repository<AssetRegistryEntity>,
  ) {}

  async findByAssetId(
    assetId: AssetRegistry['assetId'],
  ): Promise<NullableType<AssetRegistry>> {
    const entity = await this.assetRegistryRepository.findOne({
      where: { assetId },
    });

    return entity ? AssetRegistryMapper.toDomain(entity) : null;
  }

  async create(data: AssetRegistry): Promise<AssetRegistry> {
    const persistenceModel = AssetRegistryMapper.toPersistence(data);
    const newEntity = await this.assetRegistryRepository.save(
      this.assetRegistryRepository.create(persistenceModel),
    );
    return AssetRegistryMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<AssetRegistry[]> {
    const entities = await this.assetRegistryRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => AssetRegistryMapper.toDomain(entity));
  }

  async findById(
    id: AssetRegistry['id'],
  ): Promise<NullableType<AssetRegistry>> {
    const entity = await this.assetRegistryRepository.findOne({
      where: { id },
    });

    return entity ? AssetRegistryMapper.toDomain(entity) : null;
  }

  async findByIds(ids: AssetRegistry['id'][]): Promise<AssetRegistry[]> {
    const entities = await this.assetRegistryRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => AssetRegistryMapper.toDomain(entity));
  }

  async update(
    id: AssetRegistry['id'],
    payload: Partial<AssetRegistry>,
  ): Promise<AssetRegistry> {
    const entity = await this.assetRegistryRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.assetRegistryRepository.save(
      this.assetRegistryRepository.create(
        AssetRegistryMapper.toPersistence({
          ...AssetRegistryMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return AssetRegistryMapper.toDomain(updatedEntity);
  }
  async remove(id: AssetRegistry['id']): Promise<void> {
    await this.assetRegistryRepository.delete(id);
  }
  async findByProviderName(
    providerName: AssetRegistry['providerName'],
  ): Promise<AssetRegistry[]> {
    const where: any = { providerName: providerName };
    const entities = await this.assetRegistryRepository.find({
      where,
    });

    return entities.map((entity) => AssetRegistryMapper.toDomain(entity));
  }
}
