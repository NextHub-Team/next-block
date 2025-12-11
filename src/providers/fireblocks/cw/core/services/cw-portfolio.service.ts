import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import {
  Asset,
  BlockchainResponse,
  ListAssetsResponse,
  ListBlockchainsResponse,
  PaginatedAddressResponse,
  VaultAccount,
  VaultAccountsPagedResponse,
  VaultAsset,
} from '@fireblocks/ts-sdk';
import { FireblocksCwService } from '../../fireblocks-cw.service';
import {
  FireblocksAssetMetadataDto,
  FireblocksBlockchainDto,
  FireblocksDepositAddressDto,
  FireblocksUserPortfolioDto,
  FireblocksVaultAccountDto,
  FireblocksVaultAssetDto,
} from '../../dto/fireblocks-wallet.dto';
import { FireblocksCwMapper } from '../../helpers/fireblocks-cw.mapper';

@Injectable()
export class CwPortfolioService {
  private readonly logger = new Logger(CwPortfolioService.name);

  constructor(
    @Inject(forwardRef(() => FireblocksCwService))
    private readonly client: FireblocksCwService,
  ) {}

  async getVaultAccount(vaultAccountId: string): Promise<FireblocksVaultAccountDto> {
    this.ensureEnabled();
    const sdk = this.client.getSdk();
    const response = await sdk.vaults.getVaultAccount({ vaultAccountId });
    return FireblocksCwMapper.toVaultAccountDto(response.data as VaultAccount);
  }

  async getVaultAsset(
    vaultAccountId: string,
    assetId: string,
  ): Promise<FireblocksVaultAssetDto> {
    this.ensureEnabled();
    const sdk = this.client.getSdk();
    const response = await sdk.vaults.getVaultAccountAsset({
      vaultAccountId,
      assetId,
    });

    return FireblocksCwMapper.toVaultAssetDto(response.data as VaultAsset);
  }

  async getDepositAddresses(
    vaultAccountId: string,
    assetId: string,
    limit?: number,
    before?: string,
    after?: string,
  ): Promise<FireblocksDepositAddressDto[]> {
    this.ensureEnabled();
    const sdk = this.client.getSdk();
    const response = await sdk.vaults.getVaultAccountAssetAddressesPaginated({
      vaultAccountId,
      assetId,
      limit,
      before,
      after,
    });

    const data = (response.data as PaginatedAddressResponse).addresses || [];
    return data.map((item) => FireblocksCwMapper.toDepositAddressDto(item));
  }

  async listWorkspaceAssets(
    limit?: number,
    cursor?: { before?: string; after?: string },
  ): Promise<FireblocksAssetMetadataDto[]> {
    this.ensureEnabled();
    const sdk = this.client.getSdk();
    const response = await sdk.blockchainsAssets.listAssets({
      limit,
      before: cursor?.before,
      after: cursor?.after,
    });

    return (response.data as ListAssetsResponse).assets.map((asset: Asset) =>
      FireblocksCwMapper.toAssetMetadataDto(asset),
    );
  }

  async getAsset(assetId: string): Promise<FireblocksAssetMetadataDto> {
    this.ensureEnabled();
    const sdk = this.client.getSdk();
    const response = await sdk.blockchainsAssets.getAsset({ assetId });
    return FireblocksCwMapper.toAssetMetadataDto(response.data as Asset);
  }

  async listBlockchains(): Promise<FireblocksBlockchainDto[]> {
    this.ensureEnabled();
    const sdk = this.client.getSdk();
    const response = await sdk.blockchainsAssets.listBlockchains();
    return (response.data as ListBlockchainsResponse).blockchains.map(
      (blockchain: BlockchainResponse) => FireblocksCwMapper.toBlockchainDto(blockchain),
    );
  }

  async getBlockchain(blockchainId: string): Promise<FireblocksBlockchainDto> {
    this.ensureEnabled();
    const sdk = this.client.getSdk();
    const response = await sdk.blockchainsAssets.getBlockchain({
      blockchainId,
    });

    return FireblocksCwMapper.toBlockchainDto(response.data as BlockchainResponse);
  }

  async getVaultAccounts(
    limit?: number,
    before?: string,
    after?: string,
    assetId?: string,
  ): Promise<FireblocksVaultAccountDto[]> {
    this.ensureEnabled();
    const response = await this.client.getSdk().vaults.getPagedVaultAccounts({
      limit,
      before,
      after,
      assetId,
    });

    const accounts = (response.data as VaultAccountsPagedResponse).accounts || [];
    return accounts.map((account) =>
      FireblocksCwMapper.toVaultAccountDto(account as VaultAccount, account.assets as VaultAsset[] | undefined),
    );
  }

  async getUserPortfolio(customerRefId: string): Promise<FireblocksUserPortfolioDto> {
    this.ensureEnabled();
    const response = await this.client.getSdk().vaults.getPagedVaultAccounts({});
    const accounts = (response.data as VaultAccountsPagedResponse).accounts || [];
    const filtered = accounts.filter(
      (account) => (account as VaultAccount).customerRefId === customerRefId,
    );

    this.logger.debug(`Resolved ${filtered.length} vault accounts for user ${customerRefId}`);

    return FireblocksCwMapper.toUserPortfolioDto(
      customerRefId,
      filtered as VaultAccount[],
    );
  }

  private ensureEnabled(): void {
    if (!this.client.isEnabled()) {
      throw new Error('Fireblocks CW client is disabled');
    }
  }
}
