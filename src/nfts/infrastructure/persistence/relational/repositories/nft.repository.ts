import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { NftEntity } from '../entities/nft.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Nft } from '../../../../domain/nft';
import { NftRepository } from '../../nft.repository';
import { NftMapper } from '../mappers/nft.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class NftRelationalRepository implements NftRepository {
  constructor(
    @InjectRepository(NftEntity)
    private readonly nftRepository: Repository<NftEntity>,
  ) {}

  async create(data: Nft): Promise<Nft> {
    const persistenceModel = NftMapper.toPersistence(data);
    const newEntity = await this.nftRepository.save(
      this.nftRepository.create(persistenceModel),
    );
    return NftMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Nft[]> {
    const entities = await this.nftRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => NftMapper.toDomain(entity));
  }

  async findById(id: Nft['id']): Promise<NullableType<Nft>> {
    const entity = await this.nftRepository.findOne({
      where: { id },
    });

    return entity ? NftMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Nft['id'][]): Promise<Nft[]> {
    const entities = await this.nftRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => NftMapper.toDomain(entity));
  }

  async update(id: Nft['id'], payload: Partial<Nft>): Promise<Nft> {
    const entity = await this.nftRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.nftRepository.save(
      this.nftRepository.create(
        NftMapper.toPersistence({
          ...NftMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return NftMapper.toDomain(updatedEntity);
  }

  async remove(id: Nft['id']): Promise<void> {
    await this.nftRepository.delete(id);
  }
}
