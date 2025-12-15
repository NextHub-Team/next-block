import {
  Asset,
  BlockchainResponse,
  CreateAddressResponse,
  VaultAccount,
  VaultAsset,
} from '@fireblocks/ts-sdk';
import { RoleEnum } from 'src/roles/roles.enum';
import { GroupPlainToInstance } from 'src/utils/transformers/class.transformer';
import {
  FireblocksAssetMetadataDto,
  FireblocksBlockchainDto,
  FireblocksCustodialWalletDto,
  FireblocksDepositAddressDto,
  FireblocksUserPortfolioDto,
  FireblocksVaultAccountDto,
  FireblocksVaultAssetDto,
} from '../dto/fireblocks-cw-responses.dto';

export class FireblocksCwMapper {
  static toVaultAssetDto(
    asset: VaultAsset,
    roles: RoleEnum[] = [],
  ): FireblocksVaultAssetDto {
    return GroupPlainToInstance(
      FireblocksVaultAssetDto,
      {
        id: asset.id,
        total: asset.total as string | undefined,
        available: asset.available as string | undefined,
        lockedAmount: asset.lockedAmount as string | undefined,
        pending: asset.pending as string | undefined,
        totalStaked: asset.staked as string | undefined,
        balance: asset.balance as string | undefined, //TODO: Update from next Fireblocks SDK version
      },
      roles,
    );
  }

  static toVaultAccountDto(
    vault: VaultAccount,
    assets?: VaultAsset[],
    roles: RoleEnum[] = [],
  ): FireblocksVaultAccountDto {
    return GroupPlainToInstance(
      FireblocksVaultAccountDto,
      {
        id: vault.id,
        name: vault.name,
        customerRefId: (vault as { customerRefId?: string }).customerRefId,
        hiddenOnUI: vault.hiddenOnUI,
        autoFuel: (vault as { autoFuel?: boolean }).autoFuel,
        assets: assets?.map((asset) => this.toVaultAssetDto(asset, roles)),
      },
      roles,
    );
  }

  static toDepositAddressDto(
    address: CreateAddressResponse,
    roles: RoleEnum[] = [],
  ): FireblocksDepositAddressDto {
    return GroupPlainToInstance(
      FireblocksDepositAddressDto,
      {
        address: address?.address,
        tag: address?.tag,
        customerRefId: (address as { customerRefId?: string }).customerRefId,
      },
      roles,
    );
  }

  static toCustodialWalletDto(params: {
    vaultAccount: VaultAccount;
    vaultAsset: VaultAsset;
    depositAddress: CreateAddressResponse;
    roles?: RoleEnum[];
  }): FireblocksCustodialWalletDto {
    const roles = params.roles ?? [];
    const vaultAccount = this.toVaultAccountDto(
      params.vaultAccount,
      undefined,
      roles,
    );
    const vaultAsset = this.toVaultAssetDto(params.vaultAsset, roles);
    const depositAddress = this.toDepositAddressDto(
      params.depositAddress,
      roles,
    );

    return GroupPlainToInstance(
      FireblocksCustodialWalletDto,
      {
        vaultAccount,
        vaultAsset,
        depositAddress,
      },
      roles,
    );
  }

  static toAssetMetadataDto(
    asset: Asset,
    roles: RoleEnum[] = [],
  ): FireblocksAssetMetadataDto {
    return GroupPlainToInstance(
      FireblocksAssetMetadataDto,
      {
        id: asset.id,
        name: asset.displayName,
        symbol: asset.onchain?.symbol ?? asset.displaySymbol,
        type: asset.assetClass,
        hasTag: (asset as { hasTag?: boolean }).hasTag,
        blockchainId: (asset as { blockchainId?: string }).blockchainId,
        isSupported: (asset as { isSupported?: boolean }).isSupported,
      },
      roles,
    );
  }

  static toBlockchainDto(
    blockchain: BlockchainResponse,
    roles: RoleEnum[] = [],
  ): FireblocksBlockchainDto {
    return GroupPlainToInstance(
      FireblocksBlockchainDto,
      {
        id: blockchain.id,
        name: blockchain.displayName,
        description: (blockchain.metadata as { description?: string })
          ?.description,
        nativeAsset: blockchain.nativeAssetId,
        status: (blockchain.onchain as { status?: string })?.status,
      },
      roles,
    );
  }

  static toUserPortfolioDto(
    userRefId: string,
    vaultAccounts: VaultAccount[],
    roles: RoleEnum[] = [],
  ): FireblocksUserPortfolioDto {
    return GroupPlainToInstance(
      FireblocksUserPortfolioDto,
      {
        userRefId,
        vaultAccounts: vaultAccounts.map((account) =>
          this.toVaultAccountDto(
            account,
            account.assets as VaultAsset[] | undefined,
            roles,
          ),
        ),
      },
      roles,
    );
  }
}
