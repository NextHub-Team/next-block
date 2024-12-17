// import { Controller, Post, Body, Get, Query } from '@nestjs/common';
// import { FireblocksService } from './fireblocks.service';
// import {
//   ApiCreatedResponse,
//   ApiOkResponse,
//   ApiTags,
//   ApiQuery,
// } from '@nestjs/swagger';

// @ApiTags('Fireblocks')
// @Controller({
//   path: 'fireblocks',
//   version: '1',
// })
// export class FireblocksController {
//   constructor(private readonly fireblocksService: FireblocksService) {}

//   @Post('vault-account')
//   @ApiCreatedResponse({ description: 'Vault account created successfully.' })
//   async createVaultAccount(@Body('name') name: string) {
//     return await this.fireblocksService.createVaultAccount(name);
//   }

//   @Post('vault-account/asset')
//   @ApiCreatedResponse({ description: 'Asset added to vault account.' })
//   async createVaultAccountAsset(
//     @Body('vaultAccountId') vaultAccountId: string,
//     @Body('assetId') assetId: string,
//   ) {
//     return await this.fireblocksService.createVaultAccountAsset(
//       vaultAccountId,
//       assetId,
//     );
//   }

//   @Post('vault-account/deposit-address')
//   @ApiCreatedResponse({ description: 'Deposit address created.' })
//   async createDepositAddress(
//     @Body('vaultAccountId') vaultAccountId: string,
//     @Body('assetId') assetId: string,
//     @Body('description') description: string,
//   ) {
//     return await this.fireblocksService.createDepositAddress(
//       vaultAccountId,
//       assetId,
//       description,
//     );
//   }

//   @Get('vault-accounts')
//   @ApiOkResponse({ description: 'Retrieved paginated vault accounts.' })
//   @ApiQuery({ name: 'limit', required: false, type: Number })
//   async getVaultPagedAccounts(@Query('limit') limit: number) {
//     return await this.fireblocksService.getVaultPagedAccounts(limit);
//   }

//   @Post('transaction')
//   @ApiCreatedResponse({ description: 'Transaction created successfully.' })
//   async createTransaction(
//     @Body('assetId') assetId: string,
//     @Body('amount') amount: string,
//     @Body('srcId') srcId: string,
//     @Body('destId') destId: string,
//   ) {
//     return await this.fireblocksService.createTransaction(
//       assetId,
//       amount,
//       srcId,
//       destId,
//     );
//   }

//   @Get('supported-assets')
//   @ApiOkResponse({ description: 'Retrieved supported assets.' })
//   async getSupportedAssets() {
//     return await this.fireblocksService.getSupportedAssets();
//   }
// }

import { Controller, Get, Post, Body } from '@nestjs/common';
import { FireblocksService } from './fireblocks.service';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('Fireblocks')
@Controller({
  path: 'fireblocks',
  version: '1',
})
export class FireblocksController {
  constructor(private readonly fireblocksService: FireblocksService) {}

  @Get('supported-assets')
  async getSupportedAssets() {
    return await this.fireblocksService.getSupportedAssets();
  }

  @Post('check-asset')
  async checkAssetStatus(@Body('assetId') assetId: string) {
    if (!assetId) {
      return { message: 'Please provide a valid assetId' };
    }
    const result = await this.fireblocksService.checkAssetStatus(assetId);
    if (result) {
      return { message: 'Asset found', asset: result };
    }
    return { message: 'Asset not supported' };
  }
}
