import { Injectable } from '@nestjs/common';
import { CreateMainWalletDto } from './dto/create-main-wallet.dto';
import { UpdateMainWalletDto } from './dto/update-main-wallet.dto';
import { MainWalletRepository } from './infrastructure/persistence/main-wallet.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { MainWallet } from './domain/main-wallet';

@Injectable()
export class MainWalletsService {
  constructor(
    // Dependencies here
    private readonly mainWalletRepository: MainWalletRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createMainWalletDto: CreateMainWalletDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.mainWalletRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.mainWalletRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: MainWallet['id']) {
    return this.mainWalletRepository.findById(id);
  }

  findByIds(ids: MainWallet['id'][]) {
    return this.mainWalletRepository.findByIds(ids);
  }

  async update(
    id: MainWallet['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateMainWalletDto: UpdateMainWalletDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.mainWalletRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: MainWallet['id']) {
    return this.mainWalletRepository.remove(id);
  }
}
