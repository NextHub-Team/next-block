import { NftTransactionsService } from '../nft-transactions/nft-transactions.service';
import { NftTransaction } from '../nft-transactions/domain/nft-transaction';
import { WalletsService } from '../wallets/wallets.service';
import { Wallet } from '../wallets/domain/wallet';
import {
  forwardRef,
  HttpStatus,
  Inject,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { CreateNftDto } from './dto/create-nft.dto';
import { UpdateNftDto } from './dto/update-nft.dto';
import { NftRepository } from './infrastructure/persistence/nft.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Nft } from './domain/nft';

@Injectable()
export class NftsService {
  constructor(
    @Inject(forwardRef(() => NftTransactionsService))
    private readonly nftTransactionService: NftTransactionsService,

    @Inject(forwardRef(() => WalletsService))
    private readonly walletService: WalletsService,
    // Dependencies here
    private readonly nftRepository: NftRepository,
  ) {}

  async create(createNftDto: CreateNftDto) {
    // Do not remove comment below.
    // <creating-property />

    let nftTransactions: NftTransaction[] | null | undefined = undefined;

    if (createNftDto.nftTransactions) {
      const nftTransactionsObjects = await this.nftTransactionService.findByIds(
        createNftDto.nftTransactions.map((entity) => entity.id),
      );
      if (
        nftTransactionsObjects.length !== createNftDto.nftTransactions.length
      ) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            nftTransactions: 'notExists',
          },
        });
      }
      nftTransactions = nftTransactionsObjects;
    } else if (createNftDto.nftTransactions === null) {
      nftTransactions = null;
    }

    let wallet: Wallet | undefined = undefined;

    if (createNftDto.wallet) {
      const walletObject = await this.walletService.findById(
        createNftDto.wallet.id,
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

    return this.nftRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      attributes: createNftDto.attributes,

      OwnerAddress: createNftDto.OwnerAddress,

      name: createNftDto.name,

      objectUri: createNftDto.objectUri,

      metadataUri: createNftDto.metadataUri,

      contractAddress: createNftDto.contractAddress,

      blockchain: createNftDto.blockchain,

      token: createNftDto.token,

      nftTransactions,

      wallet,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.nftRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Nft['id']) {
    return this.nftRepository.findById(id);
  }

  findByIds(ids: Nft['id'][]) {
    return this.nftRepository.findByIds(ids);
  }

  async update(
    id: Nft['id'],

    updateNftDto: UpdateNftDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    let nftTransactions: NftTransaction[] | null | undefined = undefined;

    if (updateNftDto.nftTransactions) {
      const nftTransactionsObjects = await this.nftTransactionService.findByIds(
        updateNftDto.nftTransactions.map((entity) => entity.id),
      );
      if (
        nftTransactionsObjects.length !== updateNftDto.nftTransactions.length
      ) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            nftTransactions: 'notExists',
          },
        });
      }
      nftTransactions = nftTransactionsObjects;
    } else if (updateNftDto.nftTransactions === null) {
      nftTransactions = null;
    }

    let wallet: Wallet | undefined = undefined;

    if (updateNftDto.wallet) {
      const walletObject = await this.walletService.findById(
        updateNftDto.wallet.id,
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

    return this.nftRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      attributes: updateNftDto.attributes,

      OwnerAddress: updateNftDto.OwnerAddress,

      name: updateNftDto.name,

      objectUri: updateNftDto.objectUri,

      metadataUri: updateNftDto.metadataUri,

      contractAddress: updateNftDto.contractAddress,

      blockchain: updateNftDto.blockchain,

      token: updateNftDto.token,

      nftTransactions,

      wallet,
    });
  }

  remove(id: Nft['id']) {
    return this.nftRepository.remove(id);
  }
}
