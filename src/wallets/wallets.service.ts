import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { WalletRepository } from './infrastructure/persistence/wallet.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Wallet } from './domain/wallet';

@Injectable()
export class WalletsService {
  constructor(
    // Dependencies here
    private readonly walletRepository: WalletRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createWalletDto: CreateWalletDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.walletRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.walletRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Wallet['id']) {
    return this.walletRepository.findById(id);
  }

  findByIds(ids: Wallet['id'][]) {
    return this.walletRepository.findByIds(ids);
  }

  async update(
    id: Wallet['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateWalletDto: UpdateWalletDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.walletRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: Wallet['id']) {
    return this.walletRepository.remove(id);
  }
}
