import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { SupportedAssetEntity } from '../entities/supported-asset.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { SupportedAsset } from '../../../../domain/supported-asset';
import { SupportedAssetRepository } from '../../supported-asset.repository';
import { SupportedAssetMapper } from '../mappers/supported-asset.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class SupportedAssetRelationalRepository
  implements SupportedAssetRepository
{
  constructor(
    @InjectRepository(SupportedAssetEntity)
    private readonly supportedAssetRepository: Repository<SupportedAssetEntity>,
  ) {}

  async create(data: SupportedAsset): Promise<SupportedAsset> {
    const persistenceModel = SupportedAssetMapper.toPersistence(data);
    const newEntity = await this.supportedAssetRepository.save(
      this.supportedAssetRepository.create(persistenceModel),
    );
    return SupportedAssetMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<SupportedAsset[]> {
    const entities = await this.supportedAssetRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => SupportedAssetMapper.toDomain(entity));
  }

  async findById(
    id: SupportedAsset['id'],
  ): Promise<NullableType<SupportedAsset>> {
    const entity = await this.supportedAssetRepository.findOne({
      where: { id },
    });

    return entity ? SupportedAssetMapper.toDomain(entity) : null;
  }

  async findByIds(ids: SupportedAsset['id'][]): Promise<SupportedAsset[]> {
    const entities = await this.supportedAssetRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => SupportedAssetMapper.toDomain(entity));
  }

  async update(
    id: SupportedAsset['id'],
    payload: Partial<SupportedAsset>,
  ): Promise<SupportedAsset> {
    const entity = await this.supportedAssetRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.supportedAssetRepository.save(
      this.supportedAssetRepository.create(
        SupportedAssetMapper.toPersistence({
          ...SupportedAssetMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return SupportedAssetMapper.toDomain(updatedEntity);
  }

  async remove(id: SupportedAsset['id']): Promise<void> {
    await this.supportedAssetRepository.delete(id);
  }
}
