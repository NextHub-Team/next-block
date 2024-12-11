import { TransactionLogsService } from '../transaction-logs/transaction-logs.service';
import { TransactionLog } from '../transaction-logs/domain/transaction-log';

import { NftsService } from '../nfts/nfts.service';
import { Nft } from '../nfts/domain/nft';

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
    @Inject(forwardRef(() => TransactionLogsService))
    private readonly transactionLogService: TransactionLogsService,

    @Inject(forwardRef(() => NftsService))
    private readonly nftService: NftsService,

    @Inject(forwardRef(() => MainWalletsService))
    private readonly mainWalletService: MainWalletsService,

    // Dependencies here
    private readonly walletRepository: WalletRepository,
  ) {}

  async create(createWalletDto: CreateWalletDto) {
    // Do not remove comment below.
    // <creating-property />
    let transactionLog: TransactionLog[] | null | undefined = undefined;

    if (createWalletDto.transactionLog) {
      const transactionLogObjects = await this.transactionLogService.findByIds(
        createWalletDto.transactionLog.map((entity) => entity.id),
      );
      if (
        transactionLogObjects.length !== createWalletDto.transactionLog.length
      ) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            transactionLog: 'notExists',
          },
        });
      }
      transactionLog = transactionLogObjects;
    } else if (createWalletDto.transactionLog === null) {
      transactionLog = null;
    }

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
      transactionLog,

      nfts,

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
    let transactionLog: TransactionLog[] | null | undefined = undefined;

    if (updateWalletDto.transactionLog) {
      const transactionLogObjects = await this.transactionLogService.findByIds(
        updateWalletDto.transactionLog.map((entity) => entity.id),
      );
      if (
        transactionLogObjects.length !== updateWalletDto.transactionLog.length
      ) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            transactionLog: 'notExists',
          },
        });
      }
      transactionLog = transactionLogObjects;
    } else if (updateWalletDto.transactionLog === null) {
      transactionLog = null;
    }

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
      transactionLog,

      nfts,

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
