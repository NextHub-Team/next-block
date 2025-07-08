import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  HttpStatus,
} from '@nestjs/common';
import { CustodialWalletRepository } from './infrastructure/persistence/custodial-wallet.repository';
import { fireblocks } from '../common/fireblocks/fireblocks.cw';
import { CustodialWallet } from './domain/custodial-wallet';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';

@Injectable()
export class CustodialWalletsService {
  constructor(
    private readonly custodialWalletRepository: CustodialWalletRepository,
  ) {}

  async createOrGetWallet(userId: string) {
    const existingWallet = await this.custodialWalletRepository.findByUserId(
      Number(userId),
    );
    if (existingWallet) {
      return {
        message: 'Wallet already exists in database',
        wallet: existingWallet,
      };
    }

    const vaultFromFB = await this.findVaultInFireblocks(userId);
    if (vaultFromFB) {
      const savedWallet = await this.custodialWalletRepository.create({
        user: { id: userId } as any,
        vaultId: vaultFromFB.vaultId,
        custodialAddress: vaultFromFB.address,
      });
      return {
        message: 'Wallet imported from Fireblocks',
        wallet: savedWallet,
      };
    }

    const created = await this.createVaultInFireblocks(userId);
    const savedWallet = await this.custodialWalletRepository.create({
      user: { id: userId } as any,
      vaultId: created.vaultId,
      custodialAddress: created.address,
    });

    return {
      message: 'New wallet created',
      wallet: savedWallet,
    };
  }

  private async findVaultInFireblocks(
    userId: string,
  ): Promise<{ vaultId: string; address: string } | null> {
    try {
      const vaultName = `user_${userId}`;
      const fb = fireblocks;

      const vaultRes = await fb.vaults.getPagedVaultAccounts({
        namePrefix: vaultName,
      });

      const vault = vaultRes.data?.accounts?.find((v) => v.name === vaultName);
      if (!vault || !vault.id) {
        console.warn(`No vault or vault without ID found for ${vaultName}`);
        return null;
      }

      const address = await this.fetchVaultAddress(vault.id);
      if (!address) {
        console.warn(`No address found for vault ID ${vault.id}`);
        return null;
      }

      return {
        vaultId: vault.id,
        address,
      };
    } catch (err) {
      console.warn(
        `Error checking vault in Fireblocks:`,
        err?.response?.data || err?.message,
      );
      return null;
    }
  }

  async findByMe(userJwtPayload: JwtPayloadType): Promise<CustodialWallet[]> {
    const userId =
      typeof userJwtPayload === 'object'
        ? Number(userJwtPayload.id)
        : Number(userJwtPayload);

    if (isNaN(userId)) {
      throw new UnprocessableEntityException('Invalid user ID in token');
    }

    const wallets = await this.custodialWalletRepository.findByUserIds(userId);

    if (!wallets?.length) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'No custodial wallets found for the user',
      });
    }

    return wallets;
  }

  findById(id: CustodialWallet['id']) {
    return this.custodialWalletRepository.findById(id);
  }

  remove(id: CustodialWallet['id']) {
    return this.custodialWalletRepository.remove(id);
  }

  // async resolveAddressBySocialId(
  //   socialId: string | string[],
  // ): Promise<
  //   | { vaultId: string; address: string }
  //   | { vaultId: string; address: string }[]
  // > {
  //   if (Array.isArray(socialId)) {
  //     const results: { vaultId: string; address: string }[] = [];
  //     for (const id of socialId) {
  //       const result = await this.resolveSingleAddress(id);
  //       results.push(result);
  //     }
  //     return results;
  //   } else {
  //     return this.resolveSingleAddress(socialId);
  //   }
  // }

  // private async resolveSingleAddress(
  //   socialId: string,
  // ): Promise<{ vaultId: string; address: string }> {
  //   const wallet =
  //     await this.custodialWalletRepository.findByUserSocialId(socialId);
  //   if (!wallet) {
  //     throw new NotFoundException(`Wallet for socialId ${socialId} not found`);
  //   }

  //   const address = await this.fetchVaultAddress(wallet.vaultId);
  //   if (!address) {
  //     throw new NotFoundException(
  //       `No address found for vault ${wallet.vaultId}`,
  //     );
  //   }

  //   return {
  //     vaultId: wallet.vaultId,
  //     address,
  //   };
  // }

  async resolveAddressBySocialId(
    socialId: string | string[],
  ): Promise<
    | { uid: string; vaultId: string; address: string }
    | { uid: string; vaultId: string; address: string }[]
  > {
    if (Array.isArray(socialId)) {
      const results: { uid: string; vaultId: string; address: string }[] = [];
      for (const id of socialId) {
        const result = await this.resolveSingleAddress(id);
        results.push(result);
      }
      return results;
    } else {
      return this.resolveSingleAddress(socialId);
    }
  }

  private async resolveSingleAddress(
    socialId: string,
  ): Promise<{ uid: string; vaultId: string; address: string }> {
    const wallet =
      await this.custodialWalletRepository.findByUserSocialId(socialId);
    if (!wallet) {
      throw new NotFoundException(`Wallet for socialId ${socialId} not found`);
    }

    const address = await this.fetchVaultAddress(wallet.vaultId);
    if (!address) {
      throw new NotFoundException(
        `No address found for vault ${wallet.vaultId}`,
      );
    }

    return {
      uid: socialId, // اضافه شد
      vaultId: wallet.vaultId,
      address,
    };
  }

  // helpers
  private async createVaultInFireblocks(
    name: string,
  ): Promise<{ vaultId: string; address: string }> {
    const vaultRes = await fireblocks.vaults.createVaultAccount({
      createVaultAccountRequest: {
        name,
        hiddenOnUI: false,
        autoFuel: true,
      },
    });

    const vaultId = vaultRes.data?.id;
    if (!vaultId) throw new Error('Vault creation failed');

    await fireblocks.vaults.createVaultAccountAsset({
      vaultAccountId: vaultId,
      assetId: 'ETH_TEST5',
    });

    const address = await this.fetchVaultAddress(vaultId);
    if (!address) throw new Error('Address generation failed');

    return { vaultId, address };
  }

  private async fetchVaultAddress(
    vaultId: string,
  ): Promise<string | undefined> {
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
