import { MainWalletsService } from '../main-wallets/main-wallets.service';
import { MainWallet } from '../main-wallets/domain/main-wallet';

import {
  forwardRef,
  HttpStatus,
  Inject,
  UnprocessableEntityException,
} from '@nestjs/common';

import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { WalletRepository } from './infrastructure/persistence/wallet.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Wallet } from './domain/wallet';

@Injectable()
export class WalletsService {
  constructor(
    @Inject(forwardRef(() => MainWalletsService))
    private readonly mainWalletService: MainWalletsService,

    // Dependencies here
    private readonly walletRepository: WalletRepository,
  ) {}

  async create(createWalletDto: CreateWalletDto) {
    // Do not remove comment below.
    // <creating-property />

    const mainWalletObject = await this.mainWalletService.findById(
      createWalletDto.mainWallet.id,
    );
    if (!mainWalletObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          mainWallet: 'notExists',
        },
      });
    }
    const mainWallet = mainWalletObject;

    return this.walletRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      legacyAddress: createWalletDto.legacyAddress,

      blockchain: createWalletDto.blockchain,

      address: createWalletDto.address,

      mainWallet,
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

    updateWalletDto: UpdateWalletDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    let mainWallet: MainWallet | undefined = undefined;

    if (updateWalletDto.mainWallet) {
      const mainWalletObject = await this.mainWalletService.findById(
        updateWalletDto.mainWallet.id,
      );
      if (!mainWalletObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            mainWallet: 'notExists',
          },
        });
      }
      mainWallet = mainWalletObject;
    }

    return this.walletRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      legacyAddress: updateWalletDto.legacyAddress,

      blockchain: updateWalletDto.blockchain,

      address: updateWalletDto.address,

      mainWallet,
    });
  }

  remove(id: Wallet['id']) {
    return this.walletRepository.remove(id);
  }
}
