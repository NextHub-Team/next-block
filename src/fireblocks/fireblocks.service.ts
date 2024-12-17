// import { Injectable, Logger } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { Fireblocks, BasePath, TransferPeerPathType } from '@fireblocks/ts-sdk';

// @Injectable()
// export class FireblocksService {
//   private fireblocks: Fireblocks;
//   private readonly logger = new Logger(FireblocksService.name);

//   constructor(private readonly configService: ConfigService) {
//     const apiSecret = this.configService.get<string>('FIREBLOCKS_API_SECRET', {
//       infer: true,
//     });
//     const apiKey = this.configService.get<string>(
//       'FIREBLOCKS_API_KEY_NCW_ADMIN',
//       { infer: true },
//     );
//     const baseUrl = this.configService.get<string>('FIREBLOCKS_API_BASE_URL', {
//       infer: true,
//     });

//     // Logging environment variables
//     this.logger.log(
//       `FIREBLOCKS_API_SECRET: ${apiSecret ? '[Loaded]' : '[Missing]'}`,
//     );
//     this.logger.log(
//       `FIREBLOCKS_API_KEY_NCW_ADMIN: ${apiKey ? '[Loaded]' : '[Missing]'}`,
//     );
//     this.logger.log(
//       `FIREBLOCKS_API_BASE_URL: ${baseUrl || 'Using Sandbox as default'}`,
//     );

//     if (!apiSecret || !apiKey) {
//       this.logger.error('Fireblocks configuration is missing.');
//       throw new Error(
//         'Fireblocks configuration is missing. Please check your environment variables.',
//       );
//     }

//     try {
//       this.fireblocks = new Fireblocks({
//         apiKey,
//         basePath: baseUrl || BasePath.Sandbox,
//         secretKey: apiSecret,
//       });
//     } catch (error) {
//       this.logger.error('Failed to initialize Fireblocks SDK', error);
//       throw new Error(`Failed to initialize Fireblocks SDK: ${error.message}`);
//     }
//   }

//   // Cerate New Vault Account
//   // https://developers.fireblocks.com/reference/typescript-sdk
//   async createVaultAccount(name: string) {
//     try {
//       const vaultAccount = await this.fireblocks.vaults.createVaultAccount({
//         createVaultAccountRequest: {
//           name,
//           hiddenOnUI: false,
//           autoFuel: false,
//         },
//       });
//       return vaultAccount.data;
//     } catch (error) {
//       throw new Error(`Failed to create Vault Account: ${error.message}`);
//     }
//   }

//   // Add Asset To Exist Vault Account
//   //https://developers.fireblocks.com/reference/create-vault-wallet
//   async createVaultAccountAsset(vaultAccountId: string, assetId: string) {
//     try {
//       const vaultWallet = await this.fireblocks.vaults.createVaultAccountAsset({
//         vaultAccountId,
//         assetId,
//       });
//       return vaultWallet;
//     } catch (error) {
//       throw new Error(`Failed to add asset to Vault Account: ${error.message}`);
//     }
//   }

//   // Add New Deposit Asset To Exist Vault Account:
//   //https://developers.fireblocks.com/reference/create-vault-wallet
//   async createDepositAddress(
//     vaultAccountId: string,
//     assetId: string,
//     description: string,
//   ) {
//     try {
//       const depositAddress =
//         await this.fireblocks.vaults.createVaultAccountAssetAddress({
//           assetId,
//           vaultAccountId,
//           createAddressRequest: {
//             description,
//           },
//         });
//       return depositAddress;
//     } catch (error) {
//       throw new Error(`Failed to create deposit address: ${error.message}`);
//     }
//   }

//   // Get Vault Accounts List With limitation :
//   // https://developers.fireblocks.com/reference/typescript-sdk
//   async getVaultPagedAccounts(limit: number) {
//     try {
//       const vaults = await this.fireblocks.vaults.getPagedVaultAccounts({
//         limit,
//       });
//       return vaults.data;
//     } catch (error) {
//       throw new Error(`Failed to retrieve Vault Accounts: ${error.message}`);
//     }
//   }

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

//   //Get List of Supported Assets
//   //https://developers.fireblocks.com/reference/list-supported-assets
//   async getSupportedAssets() {
//     try {
//       const supportedAssets =
//         await this.fireblocks.blockchainsAssets.getSupportedAssets();
//       return supportedAssets;
//     } catch (error) {
//       throw new Error(`Failed to fetch supported assets: ${error.message}`);
//     }
//   }
// }

import { Injectable } from '@nestjs/common';
import { Fireblocks, BasePath } from '@fireblocks/ts-sdk';
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

  async getSupportedAssets(): Promise<any> {
    return await this.fireblocks.blockchainsAssets.getSupportedAssets();
  }

  async checkAssetStatus(assetId: string): Promise<any> {
    const assets = await this.getSupportedAssets();
    return assets.find((asset) => asset.id === assetId) || null;
  }
}
