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
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FireblocksCwAdminService } from '../services/fireblocks-cw-admin.service';
import {
  FireblocksAssetWalletsPageResponseDto,
  FireblocksResponseEnvelopeDto,
  FireblocksSpecialAddressesResponseDto,
  FireblocksUserPortfolioResponseDto,
  FireblocksVaultAccountResponseDto,
  FireblocksVaultAssetResponseDto,
  FireblocksVaultAccountsPageResponseDto,
} from '../dto/fireblocks-response.dto';
import { FireblocksSpecialAddressesRequestDto } from '../dto/fireblocks-vault-requests.dto';
import {
  FireblocksAssetWalletsQueryDto,
  FireblocksVaultAccountsQueryDto,
} from '../dto/fireblocks-cw-controller.dto';
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

@ApiTags('Fireblocks-CW')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard, EnableGuard)
@RequireEnabled('fireblocks.enable')
@RequireServiceReady(FireblocksCwService)
@Controller({ path: 'vaults', version: '1' })
@Roles(RoleEnum.admin)
export class FireblocksCwAdminController {
  constructor(private readonly admin: FireblocksCwAdminService) {}

  @Get('assets')
  @ApiOkResponse({ type: FireblocksAssetWalletsPageResponseDto })
  @ApiOperationRoles('List Fireblocks asset wallets', [RoleEnum.admin])
  listAssetWallets(
    @Query() query: FireblocksAssetWalletsQueryDto,
  ): Promise<FireblocksAssetWalletsPageResponseDto> {
    return this.admin.listAssetWallets(query);
  }

  @Get('users/:userId/portfolio')
  @ApiOkResponse({ type: FireblocksUserPortfolioResponseDto })
  @ApiOperationRoles('Get Fireblocks user portfolio', [RoleEnum.admin])
  getUserPortfolio(
    @Param('userId') userId: string,
  ): Promise<FireblocksUserPortfolioResponseDto> {
    return this.admin.getUserWallets(userId);
  }

  @Post('addresses')
  @ApiOkResponse({ type: FireblocksSpecialAddressesResponseDto })
  @ApiOperationRoles('Create special deposit addresses for vault assets', [
    RoleEnum.admin,
  ])
  createSpecialAddresses(
    @Body() body: FireblocksSpecialAddressesRequestDto,
  ): Promise<
    FireblocksResponseEnvelopeDto<FireblocksSpecialAddressesResponseDto>
  > {
    return this.admin.createSpecialAddresses(body);
  }

  @Get()
  @ApiOkResponse({ type: FireblocksVaultAccountsPageResponseDto })
  @ApiOperationRoles('List Fireblocks vault accounts', [RoleEnum.admin])
  listVaultAccounts(
    @Query() query: FireblocksVaultAccountsQueryDto,
  ): Promise<FireblocksVaultAccountsPageResponseDto> {
    return this.admin.listVaultAccounts(query);
  }

  @Get(':vaultAccountId')
  @ApiParam({
    name: 'vaultAccountId',
    description: 'Target Fireblocks vault account id',
    type: String,
  })
  @ApiOkResponse({ type: FireblocksVaultAccountResponseDto })
  @ApiOperationRoles('Fetch a Fireblocks vault account', [RoleEnum.admin])
  fetchVaultAccount(
    @Param('vaultAccountId') vaultAccountId: string,
  ): Promise<FireblocksVaultAccountResponseDto> {
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
  @ApiOkResponse({ type: FireblocksVaultAssetResponseDto })
  @ApiOperationRoles('Fetch a vault account asset', [RoleEnum.admin])
  fetchVaultAsset(
    @Param('vaultAccountId') vaultAccountId: string,
    @Param('assetId') assetId: string,
  ): Promise<FireblocksVaultAssetResponseDto> {
    return this.admin.fetchVaultAsset(vaultAccountId, assetId);
  }
}
