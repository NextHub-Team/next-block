import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FireblocksCwAdminService } from '../services/fireblocks-cw-admin.service';
import {
  FireblocksPaginatedAssetWalletResponseDto,
  FireblocksSpecialAddressesResponseDto,
  FireblocksVaultAccountsPageDto,
  FireblocksUserPortfolioDto,
  FireblocksVaultAccountDto,
  FireblocksVaultAssetDto,
  FireblocksAssetCatalogDto,
  FireblocksAssetMetadataDto,
  FireblocksBulkVaultAccountJobDto,
  FireblocksBulkVaultAccountsSyncDto,
} from '../dto/fireblocks-cw-responses.dto';
import {
  AssetWalletsQueryDto,
  SpecialAddressesRequestDto,
  AssetsCatalogQueryDto,
  VaultAccountsQueryDto,
  CreateAdminVaultAccountRequestDto,
  VaultAccountsByIdsQueryDto,
  BulkCreateVaultAccountsRequestDto,
} from '../dto/fireblocks-cw-requests.dto';
import { RolesGuard } from '../../../../roles/roles.guard';
import { Roles } from '../../../../roles/roles.decorator';
import { RoleEnum } from '../../../../roles/roles.enum';
import { ApiOperationRoles } from '../../../../utils/decorators/swagger.decorator';
import {
  RequireEnabled,
  RequireServiceReady,
} from '../../../../utils/decorators/service-toggleable.decorators';
import { EnableGuard } from '../../../../common/guards/service-enabled.guard';
import { FireblocksCwService } from '../fireblocks-cw.service';

@ApiTags('Fireblocks CW [SERVICES-ADMIN]')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard, EnableGuard)
@RequireEnabled('fireblocks.enable')
@RequireServiceReady(FireblocksCwService)
@Controller({ path: 'vaults', version: '1' })
@Roles(RoleEnum.admin)
export class FireblocksCwAdminController {
  constructor(private readonly admin: FireblocksCwAdminService) {}

  @Get('assets')
  @ApiOkResponse({ type: FireblocksPaginatedAssetWalletResponseDto })
  @ApiOperationRoles('List Fireblocks asset wallets', [RoleEnum.admin])
  async listAssetWallets(
    @Query() query: AssetWalletsQueryDto,
  ): Promise<FireblocksPaginatedAssetWalletResponseDto> {
    return this.admin.listAssetWallets(query);
  }

  @Get('users/:userId/portfolio')
  @ApiOkResponse({ type: FireblocksUserPortfolioDto })
  @ApiOperationRoles('Get Fireblocks user portfolio', [RoleEnum.admin])
  async getUserPortfolio(
    @Param('userId') userId: string,
  ): Promise<FireblocksUserPortfolioDto> {
    return this.admin.getUserWallets(userId);
  }

  @Post('addresses')
  @ApiCreatedResponse({ type: FireblocksSpecialAddressesResponseDto })
  @ApiOperationRoles('Create special deposit addresses for vault assets', [
    RoleEnum.admin,
  ])
  async createSpecialAddresses(
    @Body() body: SpecialAddressesRequestDto,
  ): Promise<FireblocksSpecialAddressesResponseDto> {
    return this.admin.createSpecialAddresses(body);
  }

  @Get()
  @ApiOkResponse({ type: FireblocksVaultAccountsPageDto })
  @ApiOperationRoles('List Fireblocks vault accounts', [RoleEnum.admin])
  async listVaultAccounts(
    @Query() query: VaultAccountsQueryDto,
  ): Promise<FireblocksVaultAccountsPageDto> {
    return this.admin.listVaultAccounts(query);
  }

  @Get('accounts/bulk')
  @ApiOkResponse({ type: FireblocksBulkVaultAccountsSyncDto })
  @ApiOperationRoles('Fetch Fireblocks vault accounts by ids', [RoleEnum.admin])
  async fetchVaultAccountsByIds(
    @Query() query: VaultAccountsByIdsQueryDto,
  ): Promise<FireblocksBulkVaultAccountsSyncDto> {
    return this.admin.fetchVaultAccountsByIds(query); // Syncs any found vaults into the local DB
  }

  @Post('accounts/bulk')
  @ApiCreatedResponse({ type: FireblocksBulkVaultAccountJobDto })
  @ApiOperationRoles(
    'Start a bulk Fireblocks vault account creation job for users',
    [RoleEnum.admin],
  )
  async bulkCreateVaultAccounts(
    @Body() body: BulkCreateVaultAccountsRequestDto,
  ): Promise<FireblocksBulkVaultAccountJobDto> {
    return this.admin.bulkCreateVaultAccountsForUsers(body); // Fireblocks job only; DB sync occurs on later fetch
  }

  @Post('accounts')
  @ApiCreatedResponse({ type: FireblocksVaultAccountDto })
  @ApiOperationRoles('Create a Fireblocks vault account', [RoleEnum.admin])
  async createVaultAccount(
    @Body() body: CreateAdminVaultAccountRequestDto,
  ): Promise<FireblocksVaultAccountDto> {
    return this.admin.createVaultAccount(body); // Creates vault and immediately syncs to local DB
  }

  @Get(':vaultAccountId')
  @ApiParam({
    name: 'vaultAccountId',
    description: 'Target Fireblocks vault account id',
    type: String,
  })
  @ApiOkResponse({ type: FireblocksVaultAccountDto })
  @ApiOperationRoles('Fetch a Fireblocks vault account', [RoleEnum.admin])
  async fetchVaultAccount(
    @Param('vaultAccountId') vaultAccountId: string,
  ): Promise<FireblocksVaultAccountDto> {
    return this.admin.fetchVaultAccount(vaultAccountId);
  }

  @Get(':vaultAccountId/assets/:assetId')
  @ApiParam({
    name: 'vaultAccountId',
    description: 'Fireblocks vault account id',
    type: String,
  })
  @ApiParam({
    name: 'assetId',
    description: 'Asset identifier',
    type: String,
  })
  @ApiOkResponse({ type: FireblocksVaultAssetDto })
  @ApiOperationRoles('Fetch a vault account asset', [RoleEnum.admin])
  async fetchVaultAsset(
    @Param('vaultAccountId') vaultAccountId: string,
    @Param('assetId') assetId: string,
  ): Promise<FireblocksVaultAssetDto> {
    return this.admin.fetchVaultAsset(vaultAccountId, assetId);
  }

  @Get('assets/catalog')
  @ApiOkResponse({ type: FireblocksAssetCatalogDto })
  @ApiOperationRoles('List supported assets (Fireblocks)', [RoleEnum.admin])
  async listSupportedAssets(
    @Query() query: AssetsCatalogQueryDto,
  ): Promise<FireblocksAssetCatalogDto> {
    return this.admin.listSupportedAssets(query);
  }

  @Get('assets/catalog/:assetId')
  @ApiParam({
    name: 'assetId',
    description: 'Asset identifier to fetch metadata for',
    type: String,
  })
  @ApiOkResponse({ type: FireblocksAssetMetadataDto })
  @ApiOperationRoles('Fetch asset metadata (Fireblocks)', [RoleEnum.admin])
  async fetchAssetMetadata(
    @Param('assetId') assetId: string,
  ): Promise<FireblocksAssetMetadataDto> {
    return this.admin.fetchAssetMetadata(assetId);
  }
}
