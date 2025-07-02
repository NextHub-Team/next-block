import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, In, Repository } from 'typeorm';
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
    private readonly repo: Repository<CustodialWalletEntity>,
  ) {}

  async create(
    data: Omit<CustodialWallet, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<CustodialWallet> {
    const entity = this.repo.create(
      CustodialWalletMapper.toPersistence(data as CustodialWallet),
    );
    const saved = await this.repo.save(entity);
    return CustodialWalletMapper.toDomain(saved);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<CustodialWallet[]> {
    const entities = await this.repo.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      relations: ['user'],
    });
    return entities.map(CustodialWalletMapper.toDomain);
  }

  async findById(
    id: CustodialWallet['id'],
  ): Promise<NullableType<CustodialWallet>> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ['user'],
    });
    return entity ? CustodialWalletMapper.toDomain(entity) : null;
  }

  async findByIds(ids: CustodialWallet['id'][]): Promise<CustodialWallet[]> {
    const entities = await this.repo.find({
      where: { id: In(ids) },
      relations: ['user'],
    });
    return entities.map(CustodialWalletMapper.toDomain);
  }

  async update(
    id: CustodialWallet['id'],
    payload: DeepPartial<CustodialWallet>,
  ): Promise<CustodialWallet | null> {
    await this.repo.update(
      id,
      CustodialWalletMapper.toPersistence(payload as CustodialWallet),
    );
    return this.findById(id);
  }

  async remove(id: CustodialWallet['id']): Promise<void> {
    await this.repo.delete(id);
  }

  async findByUserId(userId: number): Promise<NullableType<CustodialWallet>> {
    const entity = await this.repo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    return entity ? CustodialWalletMapper.toDomain(entity) : null;
  }

  async findByUserIds(userId: number): Promise<CustodialWallet[]> {
    const entities = await this.repo.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    return entities.map(CustodialWalletMapper.toDomain);
  }

  async findByUserSocialId(
    socialId: string,
  ): Promise<NullableType<CustodialWallet>> {
    const entity = await this.repo.findOne({
      where: { user: { socialId } },
      relations: ['user'],
    });
    return entity ? CustodialWalletMapper.toDomain(entity) : null;
  }
}
