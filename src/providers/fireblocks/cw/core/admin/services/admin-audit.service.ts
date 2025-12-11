import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PaginatedAssetWalletResponse,
  VaultAccount,
  VaultAccountsPagedResponse,
} from '@fireblocks/ts-sdk';
import { AllConfigType } from '../../../../../../config/config.type';
import { FireblocksCwService } from '../../../fireblocks-cw.service';
import { FireblocksUserPortfolioDto } from '../../../dto/fireblocks-wallet.dto';
import { FireblocksCwMapper } from '../../../helpers/fireblocks-cw.mapper';
import { AbstractCwService } from '../../base/abstract-cw.service';

@Injectable()
export class AdminAuditService extends AbstractCwService {
  constructor(
    @Inject(forwardRef(() => FireblocksCwService))
    private readonly fireblocks: FireblocksCwService,
    configService: ConfigService<AllConfigType>,
  ) {
    super(AdminAuditService.name, configService);
  }

  async getVaultAccounts(
    limit?: number,
    before?: string,
    after?: string,
    assetId?: string,
  ): Promise<VaultAccountsPagedResponse> {
    this.guardEnabledAndLog();
    const response = await this.fireblocks.getSdk().vaults.getPagedVaultAccounts({
      limit,
      before,
      after,
      assetId,
    });

    return response.data as VaultAccountsPagedResponse;
  }

  async getAssetWallets(
    limit?: number,
    before?: string,
    after?: string,
    assetId?: string,
  ): Promise<PaginatedAssetWalletResponse> {
    this.guardEnabledAndLog();
    const response = await this.fireblocks.getSdk().vaults.getAssetWallets({
      assetId,
      limit,
      before,
      after,
    });

    return response.data as PaginatedAssetWalletResponse;
  }

  async getUserWallets(customerRefId: string): Promise<FireblocksUserPortfolioDto> {
    const paged = await this.getVaultAccounts();
    const accounts = (paged.accounts || []).filter(
      (account) => (account as VaultAccount).customerRefId === customerRefId,
    );

    return FireblocksCwMapper.toUserPortfolioDto(
      customerRefId,
      accounts as VaultAccount[],
    );
  }
}
