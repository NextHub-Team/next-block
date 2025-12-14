import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
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
import { FireblocksCwClientService } from '../services/fireblocks-cw-client.service';
import { CreateVaultWalletRequestDto } from '../dto/fireblocks-vault-requests.dto';
import {
  FireblocksCustodialWalletDto,
  FireblocksVaultAccountDto,
  FireblocksVaultAccountWalletDto,
  FireblocksVaultAssetDto,
} from '../dto/fireblocks-wallet.dto';
import { FireblocksEnsureUserWalletDto } from '../dto/fireblocks-cw-controller.dto';
import { RequestWithUser } from '../../../../utils/types/object.type';
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
export class FireblocksCwClientController {
  constructor(private readonly client: FireblocksCwClientService) {}

  @Get('me/accounts')
  @ApiOkResponse({ type: FireblocksVaultAccountDto, isArray: true })
  @ApiOperationRoles('List Fireblocks vault accounts for the current user', [
    RoleEnum.admin,
  ])
  listMyVaultAccounts(
    @Request() req: RequestWithUser,
  ): Promise<FireblocksVaultAccountDto[]> {
    return this.client.listUserVaultAccounts(req.user.id);
  }

  @Get('me/wallets')
  @ApiOkResponse({ type: FireblocksVaultAccountWalletDto, isArray: true })
  @ApiOperationRoles('List all Fireblocks vault wallets for the current user', [
    RoleEnum.admin,
  ])
  listMyVaultWallets(
    @Request() req: RequestWithUser,
  ): Promise<FireblocksVaultAccountWalletDto[]> {
    return this.client.listUserVaultWallets(req.user.id);
  }

  @Get('me/accounts/:vaultAccountId/wallets')
  @ApiParam({
    name: 'vaultAccountId',
    description: 'Target vault account id',
  })
  @ApiOkResponse({ type: FireblocksVaultAssetDto, isArray: true })
  @ApiOperationRoles(
    'List wallets within a specific Fireblocks vault account for the current user',
    [RoleEnum.admin],
  )
  listMyVaultAccountWallets(
    @Request() req: RequestWithUser,
    @Param('vaultAccountId') vaultAccountId: string,
  ): Promise<FireblocksVaultAssetDto[]> {
    return this.client.listUserVaultAccountWallets(req.user.id, vaultAccountId);
  }

  @Get('me/accounts/:vaultAccountId/wallets/:assetId')
  @ApiParam({
    name: 'vaultAccountId',
    description: 'Target vault account id',
  })
  @ApiParam({
    name: 'assetId',
    description: 'Asset identifier within the vault account',
  })
  @ApiOkResponse({ type: FireblocksVaultAssetDto })
  @ApiOperationRoles(
    'Fetch a specific wallet in a Fireblocks vault account for the current user',
    [RoleEnum.admin],
  )
  getMyVaultAccountWallet(
    @Request() req: RequestWithUser,
    @Param('vaultAccountId') vaultAccountId: string,
    @Param('assetId') assetId: string,
  ): Promise<FireblocksVaultAssetDto> {
    return this.client.getUserVaultAccountWallet(
      req.user.id,
      vaultAccountId,
      assetId,
    );
  }

  @Post('wallets')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: FireblocksCustodialWalletDto })
  @ApiOperationRoles('Create a Fireblocks vault wallet for an asset', [
    RoleEnum.admin,
  ])
  createVaultWallet(
    @Request() req: RequestWithUser,
    @Body() command: CreateVaultWalletRequestDto,
  ): Promise<FireblocksCustodialWalletDto> {
    const payload: CreateVaultWalletRequestDto = {
      ...command,
      customerRefId: command.customerRefId ?? `${req.user.id}`,
    };
    return this.client.createWallet(payload);
  }

  @Post('wallets/ensure')
  @ApiOkResponse({ type: FireblocksCustodialWalletDto })
  @ApiOperationRoles(
    'Ensure the vault wallet and deposit address for a user asset',
    [RoleEnum.admin],
  )
  ensureUserWallet(
    @Request() req: RequestWithUser,
    @Body() command: FireblocksEnsureUserWalletDto,
  ): Promise<FireblocksCustodialWalletDto> {
    const userIdentity = {
      userId: req.user.id,
      providerId: command.providerId ?? null,
    };
    return this.client.ensureUserWallet(
      userIdentity,
      command.assetId,
      command.options,
    );
  }
}
