import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { TypeEntity } from '../entities/type.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Type } from '../../../../domain/type';
import { TypeRepository } from '../../type.repository';
import { TypeMapper } from '../mappers/type.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class TypeRelationalRepository implements TypeRepository {
  constructor(
    @InjectRepository(TypeEntity)
    private readonly typeRepository: Repository<TypeEntity>,
  ) {}

  async create(data: Type): Promise<Type> {
    const persistenceModel = TypeMapper.toPersistence(data);
    const newEntity = await this.typeRepository.save(
      this.typeRepository.create(persistenceModel),
    );
    return TypeMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Type[]> {
    const entities = await this.typeRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => TypeMapper.toDomain(entity));
  }

  async findById(id: Type['id']): Promise<NullableType<Type>> {
    const entity = await this.typeRepository.findOne({
      where: { id },
    });

    return entity ? TypeMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Type['id'][]): Promise<Type[]> {
    const entities = await this.typeRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => TypeMapper.toDomain(entity));
  }

  async update(id: Type['id'], payload: Partial<Type>): Promise<Type> {
    const entity = await this.typeRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.typeRepository.save(
      this.typeRepository.create(
        TypeMapper.toPersistence({
          ...TypeMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return TypeMapper.toDomain(updatedEntity);
  }

  async remove(id: Type['id']): Promise<void> {
    await this.typeRepository.delete(id);
  }
}
