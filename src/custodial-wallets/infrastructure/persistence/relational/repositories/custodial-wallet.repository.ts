import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CustodialWalletEntity } from '../entities/custodial-wallet.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { CustodialWallet } from '../../../../domain/custodial-wallet';
import { CustodialWalletRepository } from '../../custodial-wallet.repository';
import { CustodialWalletMapper } from '../mappers/custodial-wallet.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class CustodialWalletRelationalRepository
  implements CustodialWalletRepository
{
  constructor(
    @InjectRepository(CustodialWalletEntity)
    private readonly custodialWalletRepository: Repository<CustodialWalletEntity>,
  ) {}

  async create(data: CustodialWallet): Promise<CustodialWallet> {
    const persistenceModel = CustodialWalletMapper.toPersistence(data);
    const newEntity = await this.custodialWalletRepository.save(
      this.custodialWalletRepository.create(persistenceModel),
    );
    return CustodialWalletMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<CustodialWallet[]> {
    const entities = await this.custodialWalletRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => CustodialWalletMapper.toDomain(entity));
  }

  async findById(
    id: CustodialWallet['id'],
  ): Promise<NullableType<CustodialWallet>> {
    const entity = await this.custodialWalletRepository.findOne({
      where: { id },
    });

    return entity ? CustodialWalletMapper.toDomain(entity) : null;
  }

  async findByIds(ids: CustodialWallet['id'][]): Promise<CustodialWallet[]> {
    const entities = await this.custodialWalletRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => CustodialWalletMapper.toDomain(entity));
  }

  async update(
    id: CustodialWallet['id'],
    payload: Partial<CustodialWallet>,
  ): Promise<CustodialWallet> {
    const entity = await this.custodialWalletRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.custodialWalletRepository.save(
      this.custodialWalletRepository.create(
        CustodialWalletMapper.toPersistence({
          ...CustodialWalletMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return CustodialWalletMapper.toDomain(updatedEntity);
  }

  async remove(id: CustodialWallet['id']): Promise<void> {
    await this.custodialWalletRepository.delete(id);
  }

  async findByName(name: string): Promise<NullableType<CustodialWallet>> {
    const entity = await this.custodialWalletRepository.findOne({
      where: { name },
      relations: ['user'],
    });

    return entity ? CustodialWalletMapper.toDomain(entity) : null;
  }

  async findByNames(names: string[]): Promise<CustodialWallet[]> {
    const entities = await this.custodialWalletRepository.find({
      where: {
        name: In(names),
      },
      relations: ['user'],
    });

    return entities.map(CustodialWalletMapper.toDomain);
  }

  async findByUserId(userId: number): Promise<NullableType<CustodialWallet>> {
    const entity = await this.custodialWalletRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    return entity ? CustodialWalletMapper.toDomain(entity) : null;
  }

  async findByUserIds(userId: number): Promise<CustodialWallet[]> {
    const entities = await this.custodialWalletRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    return entities.map(CustodialWalletMapper.toDomain);
  }

  async findByUserSocialId(
    socialId: string,
  ): Promise<NullableType<CustodialWallet>> {
    const entity = await this.custodialWalletRepository.findOne({
      where: {
        user: {
          socialId,
        },
      },
      relations: ['user'],
    });

    return entity ? CustodialWalletMapper.toDomain(entity) : null;
  }
}
