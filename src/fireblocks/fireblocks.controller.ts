import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { FireblocksService } from './fireblocks.service';

import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { TransactionRequest, TransactionResponse } from '@fireblocks/ts-sdk';

@ApiTags('Fireblocks')
@Controller({
  path: 'fireblocks',
  version: '1',
})
export class FireblocksController {
  constructor(private readonly fireblocksService: FireblocksService) {}

  @Post('vault-account')
  @ApiCreatedResponse({ description: 'Vault account created successfully.' })
  async createVaultAccount(@Body('name') name: string) {
    return await this.fireblocksService.createVaultAccount(name);
  }

  @Post('vault-account/asset')
  @ApiCreatedResponse({ description: 'Asset added to vault account.' })
  async createVaultAccountAsset(
    @Body('vaultAccountId') vaultAccountId: string,
    @Body('assetId') assetId: string,
  ) {
    return await this.fireblocksService.createVaultAccountAsset(
      vaultAccountId,
      assetId,
    );
  }

  @Post('vault-account/deposit-address')
  @ApiCreatedResponse({ description: 'Deposit address created.' })
  async createDepositAddress(
    @Body('vaultAccountId') vaultAccountId: string,
    @Body('assetId') assetId: string,
    @Body('description') description: string,
  ) {
    return await this.fireblocksService.createDepositAddress(
      vaultAccountId,
      assetId,
      description,
    );
  }

  @Get('vault-accounts')
  @ApiOkResponse({ description: 'Retrieved paginated vault accounts.' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getVaultPagedAccounts(@Query('limit') limit: number) {
    return await this.fireblocksService.getVaultPagedAccounts(limit);
  }

  @Post('transaction/internal')
  @ApiCreatedResponse({ description: 'Transaction created successfully.' })
  async createTransaction(
    @Body('assetId') assetId: string,
    @Body('amount') amount: string,
    @Body('srcId') srcId: string,
    @Body('destId') destId: string,
  ) {
    return await this.fireblocksService.createTransaction(
      assetId,
      amount,
      srcId,
      destId,
    );
  }

  @Post('transaction/external')
  @ApiCreatedResponse({
    description: 'Transaction to external address created successfully.',
  })
  @ApiBadRequestResponse({ description: 'Invalid request parameters.' })
  async createTransactionToExternalAddress(
    @Body('assetId') assetId: string,
    @Body('amount') amount: string,
    @Body('srcId') srcId: string,
    @Body('destinationAddress') destinationAddress: string,
    @Body('tag') tag?: string,
    @Body('note') note?: string,
  ) {
    if (!assetId || !amount || !srcId || !destinationAddress) {
      throw new Error(
        'Missing required fields: assetId, amount, srcId, or destinationAddress',
      );
    }

    return await this.fireblocksService.createExternalTransaction(
      assetId,
      amount,
      srcId,
      destinationAddress,
      tag,
      note || 'External transaction',
    );
  }

  @Get('transactions/history')
  @ApiOkResponse({ description: 'Transactions retrieved successfully.' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  async getAllTransactions(
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
  ) {
    return await this.fireblocksService.getAllTransactions(limit, status);
  }

  @Get('transaction-detail/:txId')
  @ApiOkResponse({ description: 'Transaction details retrieved successfully.' })
  @ApiParam({
    name: 'txId',
    required: true,
    type: String,
    description: 'Transaction ID to retrieve details for',
  })
  async getTransactionDetail(
    @Param('txId') txId: string,
  ): Promise<TransactionResponse> {
    return await this.fireblocksService.getTransactionDetail(txId);
  }

  @Post('transaction/estimate-fee')
  @ApiCreatedResponse({
    description: 'Estimated transaction fee fetched successfully.',
  })
  async getTransactionFee(@Body() payload: TransactionRequest) {
    return await this.fireblocksService.getTransactionFee(payload);
  }

  @Post('transaction/with-fee-estimation')
  @ApiCreatedResponse({
    description: 'Transaction created successfully with fee estimation.',
  })
  async createTransactionWithFeeEstimation(
    @Body() payload: TransactionRequest,
  ) {
    return await this.fireblocksService.createTransactionWithFeeEstimation(
      payload,
    );
  }

  @Post('transaction/cancel/:txId')
  @ApiOkResponse({ description: 'Transaction canceled successfully.' })
  @ApiParam({
    name: 'txId',
    required: true,
    description: 'The ID of the transaction to cancel.',
  })
  async cancelTransaction(@Param('txId') txId: string) {
    return await this.fireblocksService.cancelTransaction(txId);
  }

  @Get('vault-account/balance')
  @ApiQuery({ name: 'vaultAccountId', required: true, type: String })
  async getVaultAccountBalance(
    @Query('vaultAccountId') vaultAccountId: string,
  ) {
    return await this.fireblocksService.getVaultAccountBalance(vaultAccountId);
  }

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

  @Get('vault-accounts/:vaultAccountId/assets/:assetId')
  async getVaultAccountAsset(
    @Param('vaultAccountId') vaultAccountId: string,
    @Param('assetId') assetId: string,
  ) {
    return this.fireblocksService.getVaultAccountAsset(vaultAccountId, assetId);
  }
}
