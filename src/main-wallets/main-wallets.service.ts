import { WalletsService } from '../wallets/wallets.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';
import {
  forwardRef,
  HttpStatus,
  Inject,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { CreateMainWalletDto } from './dto/create-main-wallet.dto';
import { UpdateMainWalletDto } from './dto/update-main-wallet.dto';
import { MainWalletRepository } from './infrastructure/persistence/main-wallet.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { MainWallet } from './domain/main-wallet';
import { PassphrasesService } from '../passphrases/passphrases.service';
import { Passphrase } from '../passphrases/domain/passphrase';

@Injectable()
export class MainWalletsService {
  constructor(
    @Inject(forwardRef(() => WalletsService))
    private readonly walletService: WalletsService,

    private readonly PassphraseService: PassphrasesService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    // Dependencies here
    private readonly mainWalletRepository: MainWalletRepository,
  ) {}

  async create(createMainWalletDto: CreateMainWalletDto) {
    // Do not remove comment below.
    // <creating-property />

    const PassphraseObject = await this.PassphraseService.findById(
      createMainWalletDto.passphrase.id,
    );
    if (!PassphraseObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          Passphrase: 'notExists',
        },
      });
    }
    const passphrase = PassphraseObject;

    const userObject = await this.userService.findById(
      createMainWalletDto.user.id,
    );
    if (!userObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          user: 'notExists',
        },
      });
    }
    const user = userObject;

    return this.mainWalletRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      type: createMainWalletDto.type,

      name: createMainWalletDto.name,

      address: createMainWalletDto.address,

      passphrase,

      user,
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

    updateMainWalletDto: UpdateMainWalletDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    let passphrase: Passphrase | undefined = undefined;

    if (updateMainWalletDto.passphrase) {
      const PassphraseObject = await this.PassphraseService.findById(
        updateMainWalletDto.passphrase.id,
      );
      if (!PassphraseObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            Passphrase: 'notExists',
          },
        });
      }
      passphrase = PassphraseObject;
    }

    let user: User | undefined = undefined;

    if (updateMainWalletDto.user) {
      const userObject = await this.userService.findById(
        updateMainWalletDto.user.id,
      );
      if (!userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            user: 'notExists',
          },
        });
      }
      user = userObject;
    }

    return this.mainWalletRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      type: updateMainWalletDto.type,

      name: updateMainWalletDto.name,

      address: updateMainWalletDto.address,
      passphrase,
      user,
    });
  }

  remove(id: MainWallet['id']) {
    return this.mainWalletRepository.remove(id);
  }
}
