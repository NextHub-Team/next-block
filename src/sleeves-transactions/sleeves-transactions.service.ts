import { FireblocksCwWalletsService } from '../fireblocks-cw-wallets/fireblocks-cw-wallets.service';
import { FireblocksCwWallet } from '../fireblocks-cw-wallets/domain/fireblocks-cw-wallet';

import { SleevesService } from '../sleeves/sleeves.service';
import { Sleeves } from '../sleeves/domain/sleeves';
import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateSleevesTransactionDto } from './dto/create-sleeves-transaction.dto';
import { UpdateSleevesTransactionDto } from './dto/update-sleeves-transaction.dto';
import { SleevesTransactionRepository } from './infrastructure/persistence/sleeves-transaction.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { SleevesTransaction } from './domain/sleeves-transaction';
import {
  SleevesTransactionPointType,
  SleevesTransactionType,
} from './types/sleeves-transaction-enum.type';

@Injectable()
export class SleevesTransactionsService {
  constructor(
    private readonly fireblocksCwWalletService: FireblocksCwWalletsService,

    private readonly sleevesService: SleevesService,

    // Dependencies here
    private readonly sleevesTransactionRepository: SleevesTransactionRepository,
  ) {}

  async create(createSleevesTransactionDto: CreateSleevesTransactionDto) {
    // Do not remove comment below.
    // <creating-property />
    const walletObject = await this.fireblocksCwWalletService.findById(
      createSleevesTransactionDto.wallet.id,
    );
    if (!walletObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          wallet: 'notExists',
        },
      });
    }
    const wallet = walletObject;

    const sleeveObject = await this.sleevesService.findById(
      createSleevesTransactionDto.sleeve.id,
    );
    if (!sleeveObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          sleeve: 'notExists',
        },
      });
    }
    const sleeve = sleeveObject;

    return this.sleevesTransactionRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      wallet,

      type:
        createSleevesTransactionDto.type ?? SleevesTransactionType.TRANSFER_IN,

      pointType:
        createSleevesTransactionDto.pointType ??
        SleevesTransactionPointType.REWARD,

      txHash: createSleevesTransactionDto.txHash,

      pointCount: createSleevesTransactionDto.pointCount,

      blockNumber: createSleevesTransactionDto.blockNumber,

      sleeve,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.sleevesTransactionRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: SleevesTransaction['id']) {
    return this.sleevesTransactionRepository.findById(id);
  }

  findByIds(ids: SleevesTransaction['id'][]) {
    return this.sleevesTransactionRepository.findByIds(ids);
  }

  async update(
    id: SleevesTransaction['id'],

    updateSleevesTransactionDto: UpdateSleevesTransactionDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let wallet: FireblocksCwWallet | undefined = undefined;

    if (updateSleevesTransactionDto.wallet) {
      const walletObject = await this.fireblocksCwWalletService.findById(
        updateSleevesTransactionDto.wallet.id,
      );
      if (!walletObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            wallet: 'notExists',
          },
        });
      }
      wallet = walletObject;
    }

    let sleeve: Sleeves | undefined = undefined;

    if (updateSleevesTransactionDto.sleeve) {
      const sleeveObject = await this.sleevesService.findById(
        updateSleevesTransactionDto.sleeve.id,
      );
      if (!sleeveObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            sleeve: 'notExists',
          },
        });
      }
      sleeve = sleeveObject;
    }

    return this.sleevesTransactionRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      ...(wallet !== undefined ? { wallet } : {}),

      ...(updateSleevesTransactionDto.type !== undefined
        ? { type: updateSleevesTransactionDto.type }
        : {}),

      ...(updateSleevesTransactionDto.pointType !== undefined
        ? { pointType: updateSleevesTransactionDto.pointType }
        : {}),

      ...(updateSleevesTransactionDto.txHash !== undefined
        ? { txHash: updateSleevesTransactionDto.txHash }
        : {}),

      ...(updateSleevesTransactionDto.pointCount !== undefined
        ? { pointCount: updateSleevesTransactionDto.pointCount }
        : {}),

      ...(updateSleevesTransactionDto.blockNumber !== undefined
        ? { blockNumber: updateSleevesTransactionDto.blockNumber }
        : {}),

      ...(sleeve !== undefined ? { sleeve } : {}),
    });
  }

  remove(id: SleevesTransaction['id']) {
    return this.sleevesTransactionRepository.remove(id);
  }
}
