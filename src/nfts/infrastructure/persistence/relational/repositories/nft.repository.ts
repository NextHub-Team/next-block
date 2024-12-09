import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { NFTEntity } from '../entities/nft.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { NFT } from '../../../../domain/nft';
import { NFTRepository } from '../../nft.repository';
import { NFTMapper } from '../mappers/nft.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class NFTRelationalRepository implements NFTRepository {
  constructor(
    @InjectRepository(NFTEntity)
    private readonly nFTRepository: Repository<NFTEntity>,
  ) {}

  async create(data: NFT): Promise<NFT> {
    const persistenceModel = NFTMapper.toPersistence(data);
    const newEntity = await this.nFTRepository.save(
      this.nFTRepository.create(persistenceModel),
    );
    return NFTMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<NFT[]> {
    const entities = await this.nFTRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => NFTMapper.toDomain(entity));
  }

  async findById(id: NFT['id']): Promise<NullableType<NFT>> {
    const entity = await this.nFTRepository.findOne({
      where: { id },
    });

    return entity ? NFTMapper.toDomain(entity) : null;
  }

  async findByIds(ids: NFT['id'][]): Promise<NFT[]> {
    const entities = await this.nFTRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => NFTMapper.toDomain(entity));
  }

  async update(id: NFT['id'], payload: Partial<NFT>): Promise<NFT> {
    const entity = await this.nFTRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.nFTRepository.save(
      this.nFTRepository.create(
        NFTMapper.toPersistence({
          ...NFTMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return NFTMapper.toDomain(updatedEntity);
  }

  async remove(id: NFT['id']): Promise<void> {
    await this.nFTRepository.delete(id);
  }
}
