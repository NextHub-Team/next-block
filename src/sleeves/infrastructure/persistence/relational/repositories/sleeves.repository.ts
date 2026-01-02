import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { SleevesEntity } from '../entities/sleeves.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Sleeves } from '../../../../domain/sleeves';
import { SleevesRepository } from '../../sleeves.repository';
import { SleevesMapper } from '../mappers/sleeves.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class SleevesRelationalRepository implements SleevesRepository {
  constructor(
    @InjectRepository(SleevesEntity)
    private readonly sleevesRepository: Repository<SleevesEntity>,
  ) {}

  async create(data: Sleeves): Promise<Sleeves> {
    const persistenceModel = SleevesMapper.toPersistence(data);
    const newEntity = await this.sleevesRepository.save(
      this.sleevesRepository.create(persistenceModel),
    );
    return SleevesMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Sleeves[]> {
    const entities = await this.sleevesRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => SleevesMapper.toDomain(entity));
  }

  async findById(id: Sleeves['id']): Promise<NullableType<Sleeves>> {
    const entity = await this.sleevesRepository.findOne({
      where: { id },
    });

    return entity ? SleevesMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Sleeves['id'][]): Promise<Sleeves[]> {
    const entities = await this.sleevesRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => SleevesMapper.toDomain(entity));
  }

  async update(id: Sleeves['id'], payload: Partial<Sleeves>): Promise<Sleeves> {
    const entity = await this.sleevesRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.sleevesRepository.save(
      this.sleevesRepository.create(
        SleevesMapper.toPersistence({
          ...SleevesMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return SleevesMapper.toDomain(updatedEntity);
  }

  async remove(id: Sleeves['id']): Promise<void> {
    await this.sleevesRepository.delete(id);
  }
}
