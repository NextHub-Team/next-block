import { NftsService } from '../nfts/nfts.service';
import { Nft } from '../nfts/domain/nft';

import { TransactionsService } from '../transactions/transactions.service';
import { Transaction } from '../transactions/domain/transaction';

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
    @Inject(forwardRef(() => NftsService))
    private readonly nftService: NftsService,

    @Inject(forwardRef(() => TransactionsService))
    private readonly transactionService: TransactionsService,

    @Inject(forwardRef(() => MainWalletsService))
    private readonly mainWalletService: MainWalletsService,

    // Dependencies here
    private readonly walletRepository: WalletRepository,
  ) {}

  async create(createWalletDto: CreateWalletDto) {
    // Do not remove comment below.
    // <creating-property />
    let nfts: Nft[] | null | undefined = undefined;

    if (createWalletDto.nfts) {
      const nftsObjects = await this.nftService.findByIds(
        createWalletDto.nfts.map((entity) => entity.id),
      );
      if (nftsObjects.length !== createWalletDto.nfts.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            nfts: 'notExists',
          },
        });
      }
      nfts = nftsObjects;
    } else if (createWalletDto.nfts === null) {
      nfts = null;
    }

    let transactions: Transaction[] | null | undefined = undefined;

    if (createWalletDto.transactions) {
      const transactionsObjects = await this.transactionService.findByIds(
        createWalletDto.transactions.map((entity) => entity.id),
      );
      if (transactionsObjects.length !== createWalletDto.transactions.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            transactions: 'notExists',
          },
        });
      }
      transactions = transactionsObjects;
    } else if (createWalletDto.transactions === null) {
      transactions = null;
    }

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
      nfts,

      transactions,

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
    let nfts: Nft[] | null | undefined = undefined;

    if (updateWalletDto.nfts) {
      const nftsObjects = await this.nftService.findByIds(
        updateWalletDto.nfts.map((entity) => entity.id),
      );
      if (nftsObjects.length !== updateWalletDto.nfts.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            nfts: 'notExists',
          },
        });
      }
      nfts = nftsObjects;
    } else if (updateWalletDto.nfts === null) {
      nfts = null;
    }

    let transactions: Transaction[] | null | undefined = undefined;

    if (updateWalletDto.transactions) {
      const transactionsObjects = await this.transactionService.findByIds(
        updateWalletDto.transactions.map((entity) => entity.id),
      );
      if (transactionsObjects.length !== updateWalletDto.transactions.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            transactions: 'notExists',
          },
        });
      }
      transactions = transactionsObjects;
    } else if (updateWalletDto.transactions === null) {
      transactions = null;
    }

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
      nfts,

      transactions,

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
