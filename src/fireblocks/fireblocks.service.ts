//   // Create Transaction Between Vault Accounts :
//   //https://developers.fireblocks.com/reference/typescript-sdk
//   async createTransaction(
//     assetId: string,
//     amount: string,
//     srcId: string,
//     destId: string,
//   ) {
//     try {
//       const transactionPayload = {
//         assetId,
//         amount,
//         source: {
//           type: TransferPeerPathType.VaultAccount,
//           id: srcId,
//         },
//         destination: {
//           type: TransferPeerPathType.VaultAccount,
//           id: destId,
//         },
//         note: 'Your first transaction!',
//       };
//       const transaction = await this.fireblocks.transactions.createTransaction({
//         transactionRequest: transactionPayload,
//       });
//       return transaction;
//     } catch (error) {
//       throw new Error(`Failed to create transaction: ${error.message}`);
//     }
//   }

import { Injectable } from '@nestjs/common';
import { Fireblocks, BasePath, TransferPeerPathType } from '@fireblocks/ts-sdk';
import { readFileSync } from 'fs';

@Injectable()
export class FireblocksService {
  private fireblocks: Fireblocks;

  constructor() {
    const FIREBLOCKS_API_KEY = process.env.FIREBLOCKS_API_KEY_ADMIN;
    const FIREBLOCKS_API_SECRET_PATH = './fireblocks_private_key.pem';

    this.fireblocks = new Fireblocks({
      apiKey: FIREBLOCKS_API_KEY,
      basePath: BasePath.US,
      secretKey: readFileSync(FIREBLOCKS_API_SECRET_PATH, 'utf8'),
    });
  }

  // Cerate New Vault Account
  // https://developers.fireblocks.com/reference/typescript-sdk
  async createVaultAccount(name: string) {
    try {
      const vaultAccount = await this.fireblocks.vaults.createVaultAccount({
        createVaultAccountRequest: {
          name,
          hiddenOnUI: false,
          autoFuel: false,
        },
      });
      return vaultAccount.data;
    } catch (error) {
      throw new Error(`Failed to create Vault Account: ${error.message}`);
    }
  }

  // Add Asset To Exist Vault Account
  // https://developers.fireblocks.com/reference/create-vault-wallet
  async createVaultAccountAsset(vaultAccountId: string, assetId: string) {
    try {
      const vaultWallet = await this.fireblocks.vaults.createVaultAccountAsset({
        vaultAccountId,
        assetId,
      });
      return vaultWallet;
    } catch (error) {
      console.error('Error Details:', error); // Log detailed error
      throw new Error(`Failed to add asset to Vault Account: ${error.message}`);
    }
  }

  // Add New Deposit Asset To Exist Vault Account:
  //https://developers.fireblocks.com/reference/create-vault-wallet
  async createDepositAddress(
    vaultAccountId: string,
    assetId: string,
    description: string,
  ) {
    try {
      const depositAddress =
        await this.fireblocks.vaults.createVaultAccountAssetAddress({
          assetId,
          vaultAccountId,
          createAddressRequest: {
            description,
          },
        });
      return depositAddress;
    } catch (error) {
      throw new Error(`Failed to create deposit address: ${error.message}`);
    }
  }

  // Get Vault Accounts List With limitation :
  // https://developers.fireblocks.com/reference/typescript-sdk
  async getVaultPagedAccounts(limit: number) {
    try {
      const vaults = await this.fireblocks.vaults.getPagedVaultAccounts({
        limit,
      });
      return vaults.data;
    } catch (error) {
      throw new Error(`Failed to retrieve Vault Accounts: ${error.message}`);
    }
  }

  // Get Vault Accounts Balance
  async getVaultAccountBalance(vaultAccountId: string) {
    try {
      const vaultAccount = await this.fireblocks.vaults.getVaultAccount({
        vaultAccountId,
      });

      if (!vaultAccount || !vaultAccount.data) {
        throw new Error(
          `The Provided Vault Account ID is invalid: ${vaultAccountId}`,
        );
      }

      if (!Array.isArray(vaultAccount.data.assets)) {
        throw new Error('Vault account assets not found');
      }

      return vaultAccount.data.assets.map((asset) => ({
        assetId: asset.id,
        balance: asset.total,
        availableBalance: asset.available,
      }));
    } catch (error) {
      console.error(
        'Error fetching Vault Account balance:',
        error.response?.data || error.message,
      );

      if (error.response?.status === 400 || error.message.includes('invalid')) {
        throw new Error(
          `The Provided Vault Account ID is invalid: ${vaultAccountId}`,
        );
      }

      throw new Error(
        `Failed to retrieve Vault Account balance: ${error.message}`,
      );
    }
  }

  // Create Transaction Between Vault Accounts :
  //https://developers.fireblocks.com/reference/typescript-sdk
  async createTransaction(
    assetId: string,
    amount: string,
    srcId: string,
    destId: string,
  ) {
    try {
      const transactionPayload = {
        assetId,
        amount,
        source: {
          type: TransferPeerPathType.VaultAccount,
          id: srcId,
        },
        destination: {
          type: TransferPeerPathType.VaultAccount,
          id: destId,
        },
        note: 'transaction',
      };
      const transaction = await this.fireblocks.transactions.createTransaction({
        transactionRequest: transactionPayload,
      });
      return transaction;
    } catch (error) {
      throw new Error(`Failed to create transaction: ${error.message}`);
    }
  }

  //Get List of Supported Assets
  //https://developers.fireblocks.com/reference/list-supported-assets
  async getSupportedAssets(): Promise<any> {
    try {
      const supportedAssets =
        await this.fireblocks.blockchainsAssets.getSupportedAssets();
      return supportedAssets;
    } catch (error) {
      throw new Error(`Failed to fetch supported assets: ${error.message}`);
    }
  }

  //Get one Supported Assets
  async checkAssetStatus(assetId: string): Promise<any> {
    const assets = await this.getSupportedAssets();

    if (Array.isArray(assets)) {
      return assets.find((asset) => asset.id === assetId) || null;
    }

    const assetList = assets.data || assets.items;
    if (Array.isArray(assetList)) {
      return assetList.find((asset) => asset.id === assetId) || null;
    }

    console.error('Unexpected response format:', assets);
    throw new Error('Unsupported response format from Fireblocks API');
  }
}
