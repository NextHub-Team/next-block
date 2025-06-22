import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { CreateCustodialWalletDto } from './dto/create-custodial-wallet.dto';
import { UpdateCustodialWalletDto } from './dto/update-custodial-wallet.dto';
import { CustodialWalletRepository } from './infrastructure/persistence/custodial-wallet.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { CustodialWallet } from './domain/custodial-wallet';
import { fireblocks } from "../common/fireblocks/fireblocks.cw"


@Injectable()
export class CustodialWalletsService {
  constructor(
    private readonly userService: UsersService,

    // Dependencies here
    private readonly custodialWalletRepository: CustodialWalletRepository,
  ) {}


async create(createCustodialWalletDto: CreateCustodialWalletDto) {
  const userObject = await this.userService.findById(createCustodialWalletDto.user.id);

  if (!userObject) {
    throw new UnprocessableEntityException({
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      errors: {
        user: 'notExists',
      },
    });
  }

  const user = userObject;

  const existing = await this.custodialWalletRepository.findByUserId(Number(user.id));
  if (existing) {
    throw new ConflictException({
      status: HttpStatus.CONFLICT,
      message: `User with ID ${user.id} already has a custodial wallet.`,
    });
  }

  let vaultId: string;
  try {
    vaultId = await this.createVaultInFireblocks(createCustodialWalletDto.name);
  } catch (error) {
    throw new InternalServerErrorException({
      message: 'Failed to create vault in Fireblocks',
      detail: error?.message,
    });
  }

  return this.custodialWalletRepository.create({
    user,
    name: createCustodialWalletDto.name,
    vaultId,
  });
}





  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.custodialWalletRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: CustodialWallet['id']) {
    return this.custodialWalletRepository.findById(id);
  }

  findByIds(ids: CustodialWallet['id'][]) {
    return this.custodialWalletRepository.findByIds(ids);
  }

  async update(
    id: CustodialWallet['id'],

    updateCustodialWalletDto: UpdateCustodialWalletDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let user: User | undefined = undefined;

    if (updateCustodialWalletDto.user) {
      const userObject = await this.userService.findById(
        updateCustodialWalletDto.user.id,
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

    return this.custodialWalletRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      user,

      name: updateCustodialWalletDto.name,

      vaultId: updateCustodialWalletDto.vaultId,
    });
  }

  remove(id: CustodialWallet['id']) {
    return this.custodialWalletRepository.remove(id);
  }


async getVaultByName(name: string) {
  const vault = await this.custodialWalletRepository.findByName(name);

  if (!vault) {
    throw new NotFoundException(`Vault not found for name "${name}"`);
  }

  return {
    vaultId: vault.vaultId,
    vaultName: vault.name,
    asset: await this.fetchAssetInfo(vault.vaultId),
    address: await this.fetchVaultAddress(vault.vaultId),
  };
}

async getVaultsByNames(
  names: string[],
): Promise<
  {
    name: string;
    vaultId: string;
    vaultName: string;
    asset: any;
    address?: string;
  }[]
> {
  const results: {
    name: string;
    vaultId: string;
    vaultName: string;
    asset: any;
    address?: string;
  }[] = [];

  for (const name of names) {
    try {
      const vaultInfo = await this.getVaultByName(name);
      if (vaultInfo) {
        results.push({
          name,
          vaultId: vaultInfo.vaultId,
          vaultName: vaultInfo.vaultName,
          asset: vaultInfo.asset,
          address: vaultInfo.address,
        });
      }
    } catch (error) {
      // فقط warning بده اما process رو متوقف نکن
      console.warn(`[VaultFetch] Failed for "${name}":`, error?.message);
    }
  }

  return results;
}

private async createVaultInFireblocks(name: string): Promise<string> {
  const result = await fireblocks.vaults.createVaultAccount({
    createVaultAccountRequest: {
      name,
      hiddenOnUI: false,
      autoFuel: true,
    },
  });

  if (!result?.data?.id) throw new Error('Vault creation failed');

  await fireblocks.vaults.createVaultAccountAsset({
    vaultAccountId: result.data.id,
    assetId: 'ETH_TEST5',
  });

  return result.data.id;
}

private async fetchAssetInfo(vaultId: string) {
  return (
    await fireblocks.vaults.getVaultAccountAsset({
      vaultAccountId: vaultId,
      assetId: 'ETH_TEST5',
    })
  ).data;
}

private async fetchVaultAddress(vaultId: string) {
  try {
    const res =
      await fireblocks.vaults.getVaultAccountAssetAddressesPaginated({
        vaultAccountId: vaultId,
        assetId: 'ETH_TEST5',
      });
    return res.data.addresses?.[0]?.address;
  } catch {
    return undefined;
  }
}

}
